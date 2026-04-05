import request from '../utils/request.js';

export const getDiscoverPostcards = (params = {}) => request.get('/postcards/discover', { params });

export const getDriftingPostcards = (params = {}) => request.get('/postcards/drifting', { params });

export const getPostcardDetail = (id) => request.get(`/postcards/detail/${id}`);

export const createPostcard = (payload) => request.post('/postcards', payload);

export const deletePostcard = (id) => request.delete(`/postcards/${id}`);

export const batchDeletePostcards = (ids) => request.delete('/postcards/batch', {
  data: { ids },
});

export const getInboxPostcards = (params = {}) => request.get('/postcards/my/inbox', { params });

export const getOutboxPostcards = (params = {}) => request.get('/postcards/my/outbox', { params });

export const getFavoritePostcards = (params = {}) => request.get('/postcards/my/favorites', { params });

export const togglePostcardLike = (id) => request.post(`/postcards/${id}/like`);

export const uploadPostcardImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return request.post('/postcards/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addPostcardDriftElement = (id, element) => request.put(`/postcards/${id}/drift-element`, { element });

export const deletePostcardDriftElement = (id, idx) => request.delete(`/postcards/${id}/drift-element/${idx}`);
