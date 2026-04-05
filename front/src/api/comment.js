import request from '../utils/request.js';

export const getComments = (postcardId) => request.get(`/comments/${postcardId}`);

export const addComment = (postcardId, content) => request.post(`/comments/${postcardId}`, { content });

export const deleteComment = (id) => request.delete(`/comments/${id}`);

export const toggleCommentPin = (id) => request.put(`/comments/${id}/pin`);

export const toggleCommentLike = (id) => request.post(`/comments/${id}/like`);
