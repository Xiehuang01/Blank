const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  getFriends,
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  getPendingRequests,
} = require('../controllers/friendController');

// 好友列表
router.get('/', auth, getFriends);

// 待处理请求
router.get('/pending', auth, getPendingRequests);

// 发送好友请求
router.post('/request', auth, sendRequest);

// 接受好友请求
router.put('/:id/accept', auth, acceptRequest);

// 拒绝好友请求
router.put('/:id/reject', auth, rejectRequest);

// 删除好友
router.delete('/:id', auth, deleteFriend);

module.exports = router;
