const router = require('express').Router();
const { auth } = require('../middleware/auth');
const pool = require('../config/db');
const { success, error } = require('../utils/response');

router.use(auth);

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, type, title, content, postcard_id, is_read, created_at
       FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    return success(res, rows.map(r => ({
      id: r.id,
      type: r.type,
      title: r.title,
      content: r.content,
      postcardId: r.postcard_id,
      isRead: !!r.is_read,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error('获取通知失败:', err);
    return error(res, '获取通知失败');
  }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    return success(res, { count: Number(rows[0]?.total || 0) });
  } catch (err) {
    return error(res, '获取未读数失败');
  }
});

// Mark all as read
router.post('/read-all', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [req.user.id]);
    return success(res, null, '已全部标记为已读');
  } catch (err) {
    return error(res, '操作失败');
  }
});

// Mark single as read
router.post('/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    return success(res, null, '已标记为已读');
  } catch (err) {
    return error(res, '操作失败');
  }
});

module.exports = router;
