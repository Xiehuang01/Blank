const { verifyToken } = require('../utils/jwt');
const redis = require('../config/redis');
const pool = require('../config/db');
const { error } = require('../utils/response');

/**
 * JWT 认证中间件
 * 从 Authorization: Bearer <token> 头中提取并验证 token
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, '未提供认证令牌', 401);
    }

    const token = authHeader.split(' ')[1];

    // 检查 token 是否在黑名单中（用户已登出）
    const isBlacklisted = await redis.get(`token_blacklist:${token}`);
    if (isBlacklisted) {
      return error(res, '令牌已失效，请重新登录', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, '令牌已过期，请重新登录', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, '无效的认证令牌', 401);
    }
    return error(res, '认证失败', 401);
  }
};

/**
 * 可选认证中间件
 * 如果有 token 则解析，无 token 也放行
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const isBlacklisted = await redis.get(`token_blacklist:${token}`);
      if (!isBlacklisted) {
        const decoded = verifyToken(token);
        req.user = decoded;
        req.token = token;
      }
    }
  } catch (err) {
    // 忽略错误，继续无认证访问
  }
  next();
};

const adminAuth = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, identity FROM users WHERE id = ? LIMIT 1', [req.user?.id]);

    if (users.length === 0) {
      return error(res, '用户不存在', 404);
    }

    if (users[0].identity !== 'admin') {
      return error(res, '无管理员权限', 403);
    }

    req.user = {
      ...req.user,
      identity: users[0].identity,
    };
    next();
  } catch (err) {
    return error(res, '管理员权限校验失败', 500);
  }
};

module.exports = { auth, optionalAuth, adminAuth };
