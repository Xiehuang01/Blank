const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  sendVerifyCode,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// 发送验证码
router.post('/verify', sendVerifyCode);

// 注册
router.post('/register', register);

// 登录
router.post('/login', login);

// 退出登录（需认证）
router.post('/logout', auth, logout);

// 忘记密码
router.post('/forgot-password', forgotPassword);

// 重置密码
router.post('/reset-password', resetPassword);

module.exports = router;
