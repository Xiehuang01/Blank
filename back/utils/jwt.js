const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'blank_default_secret';
const EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * 生成 JWT Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
};

/**
 * 验证 JWT Token
 */
const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
