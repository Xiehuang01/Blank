const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  updateAvatar,
  updatePassword,
  deleteAccount,
  getStats,
  searchUser,
} = require('../controllers/userController');

// 获取当前用户信息
router.get('/profile', auth, getProfile);

// 更新个人资料
router.put('/profile', auth, updateProfile);

// 上传头像
router.put('/avatar', auth, uploadAvatar.single('avatar'), updateAvatar);

// 修改密码
router.put('/password', auth, updatePassword);

// 删除账号
router.delete('/account', auth, deleteAccount);

// 获取用户统计
router.get('/stats', auth, getStats);

// 搜索用户
router.get('/search', auth, searchUser);

module.exports = router;
