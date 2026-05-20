import request from '../utils/request.js';

export const getNotifications = () => request.get('/notifications');
export const getUnreadCount = () => request.get('/notifications/unread-count');
export const markAllRead = () => request.post('/notifications/read-all');
export const markRead = (id) => request.post(`/notifications/${id}/read`);
