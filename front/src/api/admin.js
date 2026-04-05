import request from '../utils/request.js';

export const getAdminOverview = () => request.get('/admin/overview');

export const getAdminPostcards = (params = {}) => request.get('/admin/postcards', { params });
export const createAdminPostcard = (payload) => request.post('/admin/postcards', payload);
export const updateAdminPostcard = (id, payload) => request.put(`/admin/postcards/${id}`, payload);
export const deleteAdminPostcard = (id) => request.delete(`/admin/postcards/${id}`);

export const getAdminStampSeries = () => request.get('/admin/stamp-series');
export const createAdminStampSeries = (payload) => request.post('/admin/stamp-series', payload);
export const updateAdminStampSeries = (id, payload) => request.put(`/admin/stamp-series/${id}`, payload);
export const deleteAdminStampSeries = (id) => request.delete(`/admin/stamp-series/${id}`);

export const getAdminStamps = (params = {}) => request.get('/admin/stamps', { params });
export const createAdminStamp = (payload) => request.post('/admin/stamps', payload);
export const updateAdminStamp = (id, payload) => request.put(`/admin/stamps/${id}`, payload);
export const deleteAdminStamp = (id) => request.delete(`/admin/stamps/${id}`);

export const uploadAdminStampImage = (file, seriesName = '') => {
  const formData = new FormData();
  formData.append('image', file);
  if (seriesName) formData.append('seriesName', seriesName);
  return request.post('/admin/stamps/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getActivationCodes = () => request.get('/admin/activation-codes');
export const generateActivationCodes = (payload) => request.post('/admin/activation-codes/generate', payload);
export const deleteActivationCode = (id) => request.delete(`/admin/activation-codes/${id}`);

export const getPendingPostcards = () => request.get('/admin/audit/pending');
export const approvePostcard = (id) => request.post(`/admin/audit/${id}/approve`);
export const rejectPostcard = (id, reason) => request.post(`/admin/audit/${id}/reject`, { reason });
