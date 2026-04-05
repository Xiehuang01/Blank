import request from '../utils/request.js';

export const getFriends = () => request.get('/friends');

export const getPendingRequests = () => request.get('/friends/pending');

export const sendFriendRequest = (userId) => request.post('/friends/request', { userId });

export const acceptFriendRequest = (id) => request.put(`/friends/${id}/accept`);

export const rejectFriendRequest = (id) => request.put(`/friends/${id}/reject`);

export const deleteFriend = (id) => request.delete(`/friends/${id}`);
