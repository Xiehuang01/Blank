const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  cancelVipPayment,
  createVipPayment,
  getLatestVipPayment,
  getVipPaymentStatus,
  getVipPlans,
  handleVipPaymentNotify,
  redeemVipActivationCode,
} = require('../controllers/vipController');



// 公共接口：获取 VIP 订阅计划/价格
router.get('/plans', getVipPlans);

// 会员支付
router.post('/payments/create', auth, createVipPayment);
router.all('/payments/notify', handleVipPaymentNotify);
router.get('/payments/latest', auth, getLatestVipPayment);
router.post('/payments/:orderNo/cancel', auth, cancelVipPayment);
router.get('/payments/:orderNo', auth, getVipPaymentStatus);
router.post('/activation/redeem', auth, redeemVipActivationCode);



module.exports = router;

