const pool = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * 好友列表
 * GET /api/friends
 */
const getFriends = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.id as friendship_id, f.status, f.created_at,
              u.id, u.uid, u.username, u.avatar, u.vip_level
       FROM friends f
       JOIN users u ON (
         CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END = u.id
       )
       WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
       ORDER BY u.username`,
      [req.user.id, req.user.id, req.user.id]
    );

    const list = rows.map(r => ({
      friendshipId: r.friendship_id,
      id: r.id,
      uid: r.uid,
      username: r.username,
      avatar: r.avatar,
      vipLevel: r.vip_level,
      addedAt: r.created_at,
    }));

    return success(res, list);
  } catch (err) {
    console.error('获取好友列表错误:', err);
    return error(res, '获取好友列表失败');
  }
};

/**
 * 发送好友请求
 * POST /api/friends/request
 */
const sendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return error(res, '请提供目标用户ID', 400);
    if (userId === req.user.id) return error(res, '不能添加自己为好友', 400);

    // 检查目标用户是否存在
    const [targetUser] = await pool.query('SELECT id, username FROM users WHERE id = ?', [userId]);
    if (targetUser.length === 0) return error(res, '用户不存在', 404);

    // 检查是否已经是好友或有待处理的请求
    const [existing] = await pool.query(
      `SELECT id, status FROM friends
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [req.user.id, userId, userId, req.user.id]
    );

    if (existing.length > 0) {
      if (existing[0].status === 'accepted') return error(res, '你们已经是好友了', 409);
      if (existing[0].status === 'pending') return error(res, '好友请求已发送，等待对方回复', 409);
    }

    await pool.query(
      'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
      [req.user.id, userId, 'pending']
    );

    return success(res, null, '好友请求已发送');
  } catch (err) {
    console.error('发送好友请求错误:', err);
    return error(res, '发送好友请求失败');
  }
};

/**
 * 接受好友请求
 * PUT /api/friends/:id/accept
 */
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = ?',
      [id, req.user.id, 'pending']
    );

    if (rows.length === 0) return error(res, '好友请求不存在', 404);

    await pool.query(
      'UPDATE friends SET status = ? WHERE id = ?',
      ['accepted', id]
    );

    return success(res, null, '已接受好友请求');
  } catch (err) {
    console.error('接受好友请求错误:', err);
    return error(res, '操作失败');
  }
};

/**
 * 拒绝好友请求
 * PUT /api/friends/:id/reject
 */
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = ?',
      [id, req.user.id, 'pending']
    );

    if (rows.length === 0) return error(res, '好友请求不存在', 404);

    await pool.query(
      'UPDATE friends SET status = ? WHERE id = ?',
      ['rejected', id]
    );

    return success(res, null, '已拒绝好友请求');
  } catch (err) {
    console.error('拒绝好友请求错误:', err);
    return error(res, '操作失败');
  }
};

/**
 * 删除好友
 * DELETE /api/friends/:id
 */
const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM friends WHERE id = ? AND (user_id = ? OR friend_id = ?)',
      [id, req.user.id, req.user.id]
    );

    if (rows.length === 0) return error(res, '好友关系不存在', 404);

    await pool.query('DELETE FROM friends WHERE id = ?', [id]);
    return success(res, null, '已删除好友');
  } catch (err) {
    console.error('删除好友错误:', err);
    return error(res, '删除好友失败');
  }
};

/**
 * 获取待处理的好友请求
 * GET /api/friends/pending
 */
const getPendingRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.id as friendship_id, f.created_at,
              u.id, u.uid, u.username, u.avatar, u.vip_level
       FROM friends f
       JOIN users u ON f.user_id = u.id
       WHERE f.friend_id = ? AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    const list = rows.map(r => ({
      friendshipId: r.friendship_id,
      id: r.id,
      uid: r.uid,
      username: r.username,
      avatar: r.avatar,
      vipLevel: r.vip_level,
      requestedAt: r.created_at,
    }));

    return success(res, list);
  } catch (err) {
    console.error('获取好友请求错误:', err);
    return error(res, '获取好友请求失败');
  }
};

module.exports = {
  getFriends,
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  getPendingRequests,
};
