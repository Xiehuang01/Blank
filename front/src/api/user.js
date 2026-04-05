import request from '../utils/request.js';

export const getProfile = () => request.get('/user/profile');

export const updateProfile = (params) => request.put('/user/profile', params);

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request.put('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserStats = () => request.get('/user/stats');

export const searchUsers = (keyword) => request.get('/user/search', {
  params: { keyword },
});

export const updatePassword = (oldPassword, newPassword) => request.put('/user/password', {

  oldPassword,
  newPassword,
});

export const deleteAccount = (password) => request.delete('/user/account', {
  data: { password },
});
