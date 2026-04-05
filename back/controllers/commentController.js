const pool = require('../config/db');
const { success, error } = require('../utils/response');

const COMMENT_MAX_LENGTH = 350;

/**
 * 获取明信片评论列表
 * GET /api/comments/:postcardId
 */
const getComments = async (req, res) => {
  try {
    const { postcardId } = req.params;

    const [rows] = await pool.query(
      `SELECT c.id, c.content, c.is_pinned, c.likes_count, c.created_at,
              u.id as user_id, u.uid, u.username, u.avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.postcard_id = ?
       ORDER BY c.is_pinned DESC, c.created_at DESC`,
      [postcardId]
    );

    // 检查当前用户是否已点赞各评论
    let likedCommentIds = [];
    if (req.user) {
      const [liked] = await pool.query(
        'SELECT comment_id FROM comment_likes WHERE user_id = ?',
        [req.user.id]
      );
      likedCommentIds = liked.map(l => l.comment_id);
    }

    const list = rows.map(r => ({
      id: r.id,
      text: r.content,
      pinned: !!r.is_pinned,
      likes: r.likes_count,
      liked: likedCommentIds.includes(r.id),
      time: formatTime(r.created_at),
      createdAt: r.created_at,
      author: r.username,
      authorId: r.user_id,
      authorAvatar: r.avatar,
    }));

    return success(res, list);
  } catch (err) {
    console.error('获取评论列表错误:', err);
    return error(res, '获取评论失败');
  }
};

/**
 * 发表评论
 * POST /api/comments/:postcardId
 */
const addComment = async (req, res) => {
  try {
    const { postcardId } = req.params;
    const rawContent = typeof req.body?.content === 'string' ? req.body.content : '';
    const content = rawContent.trim();

    if (!content) return error(res, '评论内容不能为空', 400);
    if (content.length > COMMENT_MAX_LENGTH) {
      return error(res, `评论最多 ${COMMENT_MAX_LENGTH} 字`, 400);
    }

    // 检查明信片是否存在
    const [pRows] = await pool.query('SELECT id FROM postcards WHERE id = ?', [postcardId]);
    if (pRows.length === 0) return error(res, '明信片不存在', 404);

    const [result] = await pool.query(
      'INSERT INTO comments (postcard_id, user_id, content) VALUES (?, ?, ?)',
      [postcardId, req.user.id, content]
    );
    const [[user]] = await pool.query(
      'SELECT username, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    return success(res, {
      id: result.insertId,
      text: content,
      author: user?.username || req.user.username,
      authorId: req.user.id,
      authorAvatar: user?.avatar || '',
      time: '刚刚',
      likes: 0,
      liked: false,
      pinned: false,
    }, '评论发表成功', 201);
  } catch (err) {
    console.error('发表评论错误:', err);
    return error(res, '评论失败');
  }
};

/**
 * 删除评论
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT c.user_id, c.postcard_id, p.user_id as postcard_owner_id
       FROM comments c
       JOIN postcards p ON c.postcard_id = p.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return error(res, '评论不存在', 404);

    // 评论作者或明信片作者可以删除
    if (rows[0].user_id !== req.user.id && rows[0].postcard_owner_id !== req.user.id) {
      return error(res, '无权限删除', 403);
    }

    await pool.query('DELETE FROM comment_likes WHERE comment_id = ?', [id]);
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);

    return success(res, null, '评论已删除');
  } catch (err) {
    console.error('删除评论错误:', err);
    return error(res, '删除评论失败');
  }
};

/**
 * 置顶/取消置顶
 * PUT /api/comments/:id/pin
 */
const togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT c.is_pinned, c.postcard_id, p.user_id as postcard_owner_id
       FROM comments c
       JOIN postcards p ON c.postcard_id = p.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return error(res, '评论不存在', 404);

    // 只有明信片作者可以置顶
    if (rows[0].postcard_owner_id !== req.user.id) {
      return error(res, '只有明信片作者可以置顶评论', 403);
    }

    const newPinned = rows[0].is_pinned ? 0 : 1;
    await pool.query('UPDATE comments SET is_pinned = ? WHERE id = ?', [newPinned, id]);

    return success(res, { pinned: !!newPinned }, newPinned ? '已置顶' : '已取消置顶');
  } catch (err) {
    console.error('置顶评论错误:', err);
    return error(res, '操作失败');
  }
};

/**
 * 评论点赞
 * POST /api/comments/:id/like
 */
const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const [comment] = await pool.query('SELECT id FROM comments WHERE id = ?', [commentId]);
    if (comment.length === 0) return error(res, '评论不存在', 404);

    const [existing] = await pool.query(
      'SELECT id FROM comment_likes WHERE user_id = ? AND comment_id = ?',
      [req.user.id, commentId]
    );

    if (existing.length > 0) {
      // 取消点赞
      await pool.query('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?', [req.user.id, commentId]);
      await pool.query('UPDATE comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?', [commentId]);
      const [[{ likes_count }]] = await pool.query('SELECT likes_count FROM comments WHERE id = ?', [commentId]);
      return success(res, { liked: false, likes: likes_count }, '已取消点赞');
    } else {
      // 点赞
      await pool.query(
        'INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)',
        [req.user.id, commentId]
      );
      await pool.query('UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?', [commentId]);
      const [[{ likes_count }]] = await pool.query('SELECT likes_count FROM comments WHERE id = ?', [commentId]);
      return success(res, { liked: true, likes: likes_count }, '已点赞');
    }
  } catch (err) {
    console.error('评论点赞错误:', err);
    return error(res, '操作失败');
  }
};

// 时间格式化辅助函数
function formatTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

module.exports = { getComments, addComment, deleteComment, togglePin, likeComment };
