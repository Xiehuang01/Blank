import request from '../utils/request.js';

export const getVipPlans = () => request.get('/vip/plans', {
  skipGlobalLoading: true,
});

export const createVipPayment = (planKey, payType = 'alipay') => request.post('/vip/payments/create', {
  planKey,
  payType,
}, {
  skipGlobalLoading: true,
});

export const getVipPaymentStatus = (orderNo) => request.get(`/vip/payments/${orderNo}`, {
  skipGlobalLoading: true,
});

export const getLatestVipPayment = () => request.get('/vip/payments/latest', {
  skipGlobalLoading: true,
});

export const cancelVipPayment = (orderNo) => request.post(`/vip/payments/${orderNo}/cancel`, {}, {
  skipGlobalLoading: true,
});

export const redeemVipActivationCode = (code) => request.post('/vip/activation/redeem', {


  code,
}, {
  skipGlobalLoading: true,
});

