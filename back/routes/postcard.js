const router = require('express').Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { uploadPostcard } = require('../middleware/upload');
const {
  getDiscover,
  getDrifting,
  getDetail,
  create,
  deletePostcard,
  batchDelete,
  getInbox,
  getOutbox,
  toggleLike,
  getFavorites,
  uploadImage,
  addDriftElement,
  deleteDriftElement,
} = require('../controllers/postcardController');

// 公开接口（可选认证以标记点赞状态）
router.get('/discover', optionalAuth, getDiscover);
router.get('/drifting', optionalAuth, getDrifting);
router.get('/detail/:id', optionalAuth, getDetail);

// 需要认证的接口
router.post('/', auth, create);
router.delete('/batch', auth, batchDelete);
router.delete('/:id', auth, deletePostcard);

// 个人明信片
router.get('/my/inbox', auth, getInbox);
router.get('/my/outbox', auth, getOutbox);
router.get('/my/favorites', auth, getFavorites);

// 点赞
router.post('/:id/like', auth, toggleLike);

// 图片上传
router.post('/upload-image', auth, uploadPostcard.single('image'), uploadImage);

// 漂流元素
router.put('/:id/drift-element', auth, addDriftElement);
router.delete('/:id/drift-element/:idx', auth, deleteDriftElement);

module.exports = router;
