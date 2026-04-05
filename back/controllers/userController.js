const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * 获取当前用户信息
 * GET /api/user/profile
 */
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT id, uid, username, email, identity, avatar, vip_level, coins,
              gender, birthday, location, profile_visibility, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return error(res, '用户不存在', 404);
    }

    const user = users[0];
    return success(res, {
      id: user.id,
      uid: user.uid,
      username: user.username,
      email: user.email,
      identity: user.identity,
      avatar: user.avatar,
      vipLevel: user.vip_level,
      coins: user.coins,
      gender: user.gender,
      birthday: user.birthday,
      location: user.location,
      profileVisibility: user.profile_visibility,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    return error(res, '获取用户信息失败');
  }
};

/**
 * 更新个人资料
 * PUT /api/user/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { username, gender, birthday, location, profileVisibility } = req.body;
    const updates = [];
    const values = [];

    if (username !== undefined) {
      // 检查用户名唯一性
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.user.id]
      );
      if (existing.length > 0) {
        return error(res, '该用户名已被使用', 409);
      }
      updates.push('username = ?');
      values.push(username);
    }
    if (gender !== undefined) { updates.push('gender = ?'); values.push(gender); }
    if (birthday !== undefined) { updates.push('birthday = ?'); values.push(birthday); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (profileVisibility !== undefined) {
      const validVisibilities = ['所有人', '仅好友', '仅自己'];
      if (!validVisibilities.includes(profileVisibility)) {
        return error(res, '无效的资料可见性设置', 400);
      }
      updates.push('profile_visibility = ?');
      values.push(profileVisibility);
    }

    if (updates.length === 0) {
      return error(res, '没有需要更新的字段', 400);
    }

    updates.push('updated_at = NOW()');
    values.push(req.user.id);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return success(res, null, '资料更新成功');
  } catch (err) {
    console.error('更新资料错误:', err);
    return error(res, '更新资料失败');
  }
};

/**
 * 上传头像
 * PUT /api/user/avatar
 */
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, '请上传头像文件', 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await pool.query(
      'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
      [avatarUrl, req.user.id]
    );

    return success(res, { avatar: avatarUrl }, '头像更新成功');
  } catch (err) {
    console.error('上传头像错误:', err);
    return error(res, '上传头像失败');
  }
};

/**
 * 修改密码
 * PUT /api/user/password
 */
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return error(res, '请提供旧密码和新密码', 400);
    }
    if (newPassword.length < 6) {
      return error(res, '新密码长度不能少于6位', 400);
    }

    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return error(res, '用户不存在', 404);

    const isMatch = await bcrypt.compare(oldPassword, users[0].password_hash);
    if (!isMatch) return error(res, '旧密码不正确', 400);

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.user.id]);

    return success(res, null, '密码修改成功');
  } catch (err) {
    console.error('修改密码错误:', err);
    return error(res, '修改密码失败');
  }
};

/**
 * 删除账号
 * DELETE /api/user/account
 */
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return error(res, '请提供密码确认', 400);

    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return error(res, '用户不存在', 404);

    const isMatch = await bcrypt.compare(password, users[0].password_hash);
    if (!isMatch) return error(res, '密码不正确', 400);

    // 删除用户相关数据
    await pool.query('DELETE FROM comment_likes WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM comments WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM likes WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM friends WHERE user_id = ? OR friend_id = ?', [req.user.id, req.user.id]);
    await pool.query('DELETE FROM user_stamps WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM checkins WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM postcards WHERE user_id = ?', [req.user.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);

    return success(res, null, '账号已删除');
  } catch (err) {
    console.error('删除账号错误:', err);
    return error(res, '删除账号失败');
  }
};

/**
 * 获取用户统计数据
 * GET /api/user/stats
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[sentCount]] = await pool.query(
      'SELECT COUNT(*) as count FROM postcards WHERE user_id = ?', [userId]
    );
    const [[receivedCount]] = await pool.query(
      `SELECT COUNT(*) as count FROM postcards
       WHERE recipient_input IN (SELECT uid FROM users WHERE id = ?)
         AND user_id != ?`,
      [userId, userId]
    );
    const [[likesCount]] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE postcard_id IN (SELECT id FROM postcards WHERE user_id = ?)',
      [userId]
    );

    return success(res, {
      sent: sentCount.count,
      received: receivedCount.count,
      likes: likesCount.count,
    });
  } catch (err) {
    console.error('获取统计数据错误:', err);
    return error(res, '获取统计数据失败');
  }
};

/**
 * 搜索用户
 * GET /api/user/search?keyword=xxx
 */
const searchUser = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return error(res, '请提供搜索关键词', 400);

    const [users] = await pool.query(
      `SELECT id, uid, username, avatar, vip_level
       FROM users
       WHERE (uid LIKE ? OR username LIKE ?) AND id != ?
       LIMIT 20`,
      [`%${keyword}%`, `%${keyword}%`, req.user.id]
    );

    const result = users.map(u => ({
      id: u.id,
      uid: u.uid,
      username: u.username,
      avatar: u.avatar,
      vipLevel: u.vip_level,
    }));

    return success(res, result);
  } catch (err) {
    console.error('搜索用户错误:', err);
    return error(res, '搜索失败');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  updatePassword,
  deleteAccount,
  getStats,
  searchUser,
};
