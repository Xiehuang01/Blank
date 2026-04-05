const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const redis = require('../config/redis');
const { generateToken } = require('../utils/jwt');
const { generateCode, generateUID } = require('../utils/helpers');
const { sendVerificationEmail } = require('../config/mail');
const { success, error } = require('../utils/response');

const DEFAULT_AVATAR_POOL = [
  '/uploads/defaultAvatar/1.png',
  '/uploads/defaultAvatar/2.png',
  '/uploads/defaultAvatar/3.png',
  '/uploads/defaultAvatar/4.png',
  '/uploads/defaultAvatar/5.png',
];

const pickRandomDefaultAvatar = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATAR_POOL.length);
  return DEFAULT_AVATAR_POOL[randomIndex];
};

/**
 * 发送验证码
 * POST /api/auth/verify
 */
const sendVerifyCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, '请提供邮箱地址', 400);

    // 检查是否频繁发送（60秒内只能发一次）
    const cooldownKey = `verify_cooldown:${email}`;
    const hasCooldown = await redis.get(cooldownKey);
    if (hasCooldown) {
      return error(res, '验证码发送过于频繁，请稍后再试', 429);
    }

    // 生成验证码
    const code = generateCode(parseInt(process.env.VERIFICATION_CODE_LENGTH) || 6);
    const expiry = parseInt(process.env.EMAIL_VERIFY_EXPIRY) || 3600;

    // 保存到 Redis
    await redis.set(`verify:${email}`, code, 'EX', expiry);
    await redis.set(cooldownKey, '1', 'EX', 60);

    // 发送邮件
    await sendVerificationEmail(email, code);

    return success(res, null, '验证码已发送到您的邮箱');
  } catch (err) {
    console.error('发送验证码错误:', err);
    return error(res, '验证码发送失败，请稍后重试');
  }
};

/**
 * 注册
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, verifyCode } = req.body;

    if (!username || !email || !password || !verifyCode) {
      return error(res, '请填写所有必填字段', 400);
    }

    if (password.length < 6) {
      return error(res, '密码长度不能少于6位', 400);
    }

    // 验证验证码
    const storedCode = await redis.get(`verify:${email}`);
    if (!storedCode) {
      return error(res, '验证码已过期，请重新获取', 400);
    }
    if (storedCode !== verifyCode) {
      return error(res, '验证码不正确', 400);
    }

    // 检查邮箱是否已注册
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return error(res, '该邮箱已被注册', 409);
    }

    // 检查用户名是否已存在
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return error(res, '该用户名已被使用', 409);
    }

    // 生成唯一 UID
    let uid;
    let uidExists = true;
    while (uidExists) {
      uid = generateUID();
      const [rows] = await pool.query('SELECT id FROM users WHERE uid = ?', [uid]);
      uidExists = rows.length > 0;
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    const defaultAvatar = pickRandomDefaultAvatar();

    // 插入用户
    const [result] = await pool.query(
      `INSERT INTO users (uid, username, email, password_hash, avatar, vip_level, coins)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uid, username, email, passwordHash, defaultAvatar, 'VIP 0', 100]
    );

    // 清除验证码
    await redis.del(`verify:${email}`);

    // 生成 token
    const token = generateToken({ id: result.insertId, uid, username, email });

    return success(res, {
      token,
      userInfo: {
        id: result.insertId,
        uid,
        username,
        email,
        avatar: defaultAvatar,
        vipLevel: 'VIP 0',
        coins: 100,
      },
    }, '注册成功');
  } catch (err) {
    console.error('注册错误:', err);
    return error(res, '注册失败，请稍后重试');
  }
};

/**
 * 登录
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, '请填写邮箱和密码', 400);
    }

    // 查找用户
    const [users] = await pool.query(
      'SELECT id, uid, username, email, password_hash, avatar, vip_level, coins FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return error(res, '邮箱或密码不正确', 401);
    }

    const user = users[0];

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, '邮箱或密码不正确', 401);
    }

    // 生成 token
    const token = generateToken({
      id: user.id,
      uid: user.uid,
      username: user.username,
      email: user.email,
    });

    return success(res, {
      token,
      userInfo: {
        id: user.id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        vipLevel: user.vip_level,
        coins: user.coins,
      },
    }, '登录成功');
  } catch (err) {
    console.error('登录错误:', err);
    return error(res, '登录失败，请稍后重试');
  }
};

/**
 * 退出登录
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // 将当前 token 加入黑名单，过期时间与 JWT 一致
    const token = req.token;
    await redis.set(`token_blacklist:${token}`, '1', 'EX', 7 * 24 * 3600);
    return success(res, null, '已退出登录');
  } catch (err) {
    console.error('退出登录错误:', err);
    return error(res, '退出登录失败');
  }
};

/**
 * 忘记密码 - 发送验证码
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, '请提供邮箱地址', 400);

    // 检查邮箱是否存在
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return error(res, '该邮箱未注册', 404);
    }

    // 发送验证码（同 sendVerifyCode 逻辑）
    const cooldownKey = `verify_cooldown:${email}`;
    const hasCooldown = await redis.get(cooldownKey);
    if (hasCooldown) {
      return error(res, '验证码发送过于频繁，请稍后再试', 429);
    }

    const code = generateCode(6);
    const expiry = parseInt(process.env.EMAIL_VERIFY_EXPIRY) || 3600;
    await redis.set(`verify:${email}`, code, 'EX', expiry);
    await redis.set(cooldownKey, '1', 'EX', 60);
    await sendVerificationEmail(email, code);

    return success(res, null, '验证码已发送');
  } catch (err) {
    console.error('忘记密码错误:', err);
    return error(res, '操作失败，请稍后重试');
  }
};

/**
 * 重置密码
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { email, verifyCode, newPassword } = req.body;
    if (!email || !verifyCode || !newPassword) {
      return error(res, '请填写所有必填字段', 400);
    }

    if (newPassword.length < 6) {
      return error(res, '密码长度不能少于6位', 400);
    }

    // 验证验证码
    const storedCode = await redis.get(`verify:${email}`);
    if (!storedCode || storedCode !== verifyCode) {
      return error(res, '验证码不正确或已过期', 400);
    }

    // 更新密码
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
    await redis.del(`verify:${email}`);

    return success(res, null, '密码已重置，请使用新密码登录');
  } catch (err) {
    console.error('重置密码错误:', err);
    return error(res, '重置密码失败');
  }
};

module.exports = {
  sendVerifyCode,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
