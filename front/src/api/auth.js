import request from '../utils/request.js';

export const sendVerifyCode = (email) => request.post('/auth/verify', { email });

export const register = (params) => request.post('/auth/register', params);

export const login = (params) => request.post('/auth/login', params);

export const logout = () => request.post('/auth/logout');

export const forgotPassword = (email) => request.post('/auth/forgot-password', { email });

export const resetPassword = (email, verifyCode, newPassword) =>
  request.post('/auth/reset-password', { email, verifyCode, newPassword });
