const router = require('express').Router();
const { auth, optionalAuth } = require('../middleware/auth');
const { getStampSeries, getStamps, getMyStamps, purchaseStamp } = require('../controllers/stampController');

// 获取邮票系列
router.get('/series', getStampSeries);

// 获取所有邮票
router.get('/', optionalAuth, getStamps);

// 我的邮票
router.get('/my', auth, getMyStamps);

// 购买邮票
router.post('/purchase', auth, purchaseStamp);

module.exports = router;
