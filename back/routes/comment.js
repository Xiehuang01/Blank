const router = require('express').Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getComments,
  addComment,
  deleteComment,
  togglePin,
  likeComment,
} = require('../controllers/commentController');

// 获取评论列表（可选认证以标记点赞状态）
router.get('/:postcardId', optionalAuth, getComments);

// 发表评论
router.post('/:postcardId', auth, addComment);

// 删除评论
router.delete('/:id', auth, deleteComment);

// 置顶/取消置顶
router.put('/:id/pin', auth, togglePin);

// 评论点赞
router.post('/:id/like', auth, likeComment);

module.exports = router;
