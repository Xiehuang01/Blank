const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getStatus, doCheckin, claimPostcardTaskReward } = require('../controllers/checkinController');

// 获取签到状态
router.get('/status', auth, getStatus);

// 执行签到
router.post('/', auth, doCheckin);

// 领取发送明信片任务奖励
router.post('/postcard-task-reward', auth, claimPostcardTaskReward);

module.exports = router;
