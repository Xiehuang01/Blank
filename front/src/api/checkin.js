import request from '../utils/request.js';

export const getCheckinStatus = () => request.get('/checkin/status');

export const doCheckin = () => request.post('/checkin');

export const claimPostcardTaskReward = () => request.post('/checkin/postcard-task-reward');
