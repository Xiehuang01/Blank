import request from '../utils/request.js';

export const getStamps = (params = {}) => request.get('/stamps', { params });

export const getMyStamps = () => request.get('/stamps/my');

export const purchaseStamp = (stampId, quantity = 1) => request.post('/stamps/purchase', {
  stampId,
  quantity,
});
