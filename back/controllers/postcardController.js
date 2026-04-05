const pool = require('../config/db');
const { success, error, paginate } = require('../utils/response');
const { moderatePostcard } = require('../services/moderation');

let ensureDeleteColumnsPromise = null;

const ensurePostcardDeleteColumns = async () => {
  if (ensureDeleteColumnsPromise) return ensureDeleteColumnsPromise;

  ensureDeleteColumnsPromise = (async () => {
    const [senderDeletedColumns] = await pool.query("SHOW COLUMNS FROM postcards LIKE 'sender_deleted'");
    if (senderDeletedColumns.length === 0) {
      await pool.query("ALTER TABLE postcards ADD COLUMN sender_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '发件人是否删除'");
    }

    const [recipientDeletedColumns] = await pool.query("SHOW COLUMNS FROM postcards LIKE 'recipient_deleted'");
    if (recipientDeletedColumns.length === 0) {
      await pool.query("ALTER TABLE postcards ADD COLUMN recipient_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '收件人是否删除'");
    }
  })().catch((err) => {
    ensureDeleteColumnsPromise = null;
    throw err;
  });

  return ensureDeleteColumnsPromise;
};

const cleanupPostcardsIfFullyDeleted = async (connection, ids) => {
  if (!ids || ids.length === 0) return;

  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await connection.query(
    `SELECT id FROM postcards
     WHERE id IN (${placeholders})
       AND sender_deleted = 1
       AND (recipient_deleted = 1 OR recipient_input IS NULL OR recipient_input = '')`,
    ids
  );

  const deletableIds = rows.map((item) => item.id);
  if (deletableIds.length === 0) return;

  const deletePlaceholders = deletableIds.map(() => '?').join(',');
  await connection.query(
    `DELETE FROM comments WHERE postcard_id IN (${deletePlaceholders})`,
    deletableIds
  );
  await connection.query(
    `DELETE FROM likes WHERE postcard_id IN (${deletePlaceholders})`,
    deletableIds
  );
  await connection.query(
    `DELETE FROM postcards WHERE id IN (${deletePlaceholders})`,
    deletableIds
  );
};

/**
 * 发现列表（公开明信片）
 * GET /api/postcards/discover?page=1&pageSize=20
 */
const getDiscover = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM postcards
       WHERE is_public = 1 AND postcard_type = 'normal' AND status = 'sent' AND sender_deleted = 0`
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.image_url, p.aspect_ratio, p.postcard_type,
              p.image_offset_x, p.image_offset_y, p.image_scale, p.image_rotation,
              p.created_at,
              u.id as author_id, u.uid as author_uid, u.username as author_name, u.avatar as author_avatar,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM postcards p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_public = 1 AND p.postcard_type = 'normal' AND p.status = 'sent' AND p.sender_deleted = 0
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    // 如果用户已登录，标记是否已点赞
    let likedIds = [];
    if (req.user) {
      const [liked] = await pool.query(
        'SELECT postcard_id FROM likes WHERE user_id = ?',
        [req.user.id]
      );
      likedIds = liked.map(l => l.postcard_id);
    }

    const list = rows.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      postcardType: r.postcard_type,
      imageOffset: { x: r.image_offset_x || 0, y: r.image_offset_y || 0 },
      imageScale: r.image_scale || 1,
      imageRotation: r.image_rotation || 0,
      createdAt: r.created_at,
      author: {
        id: r.author_id,
        uid: r.author_uid,
        username: r.author_name,
        avatar: r.author_avatar,
      },
      likeCount: r.like_count,
      isLiked: likedIds.includes(r.id),
    }));

    return paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取发现列表错误:', err);
    return error(res, '获取列表失败');
  }
};

/**
 * 漂流传递列表
 * GET /api/postcards/drifting?page=1&pageSize=20
 */
const getDrifting = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM postcards
       WHERE postcard_type = 'drifting' AND status = 'sent' AND sender_deleted = 0`
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.image_url, p.aspect_ratio, p.postcard_type,
              p.elements, p.canvas_width, p.canvas_height,
              p.image_offset_x, p.image_offset_y, p.image_scale, p.image_rotation,
              p.created_at,
              u.id as author_id, u.uid as author_uid, u.username as author_name, u.avatar as author_avatar,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM postcards p
       JOIN users u ON p.user_id = u.id
       WHERE p.postcard_type = 'drifting' AND p.status = 'sent' AND p.sender_deleted = 0
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    let likedIds = [];
    if (req.user) {
      const [liked] = await pool.query(
        'SELECT postcard_id FROM likes WHERE user_id = ?',
        [req.user.id]
      );
      likedIds = liked.map(l => l.postcard_id);
    }

    const list = rows.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      postcardType: r.postcard_type,
      elements: typeof r.elements === 'string' ? JSON.parse(r.elements || '[]') : (r.elements || []),
      canvasWidth: r.canvas_width,
      canvasHeight: r.canvas_height,
      imageOffset: { x: r.image_offset_x || 0, y: r.image_offset_y || 0 },
      imageScale: r.image_scale || 1,
      imageRotation: r.image_rotation || 0,
      createdAt: r.created_at,
      author: {
        id: r.author_id,
        uid: r.author_uid,
        username: r.author_name,
        avatar: r.author_avatar,
      },
      likeCount: r.like_count,
      isLiked: likedIds.includes(r.id),
    }));

    return paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取漂流列表错误:', err);
    return error(res, '获取列表失败');
  }
};

/**
 * 明信片详情
 * GET /api/postcards/:id
 */
const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, u.id as author_id, u.uid as author_uid, u.username as author_name, u.avatar as author_avatar,
              s.id as stamp_id, s.title as stamp_title, s.image_path as stamp_image,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM postcards p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN stamps s ON p.stamp_id = s.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) return error(res, '明信片不存在', 404);

    const r = rows[0];
    let isLiked = false;
    if (req.user) {
      const [liked] = await pool.query(
        'SELECT id FROM likes WHERE user_id = ? AND postcard_id = ?',
        [req.user.id, id]
      );
      isLiked = liked.length > 0;
    }

    return success(res, {
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      postcardType: r.postcard_type,
      elements: typeof r.elements === 'string' ? JSON.parse(r.elements || '[]') : (r.elements || []),
      canvasWidth: r.canvas_width,
      canvasHeight: r.canvas_height,
      imageOffset: { x: r.image_offset_x || 0, y: r.image_offset_y || 0 },
      imageScale: r.image_scale || 1,
      imageRotation: r.image_rotation || 0,
      stamp: r.stamp_id ? { id: r.stamp_id, title: r.stamp_title, image: r.stamp_image } : null,
      recipientInput: r.recipient_input,
      isPublic: !!r.is_public,
      status: r.status,
      createdAt: r.created_at,
      author: {
        id: r.author_id,
        uid: r.author_uid,
        username: r.author_name,
        avatar: r.author_avatar,
      },
      likeCount: r.like_count,
      isLiked,
      isOwner: req.user ? req.user.id === r.user_id : false,
    });
  } catch (err) {
    console.error('获取明信片详情错误:', err);
    return error(res, '获取详情失败');
  }
};

/**
 * 创建明信片
 * POST /api/postcards
 */
const create = async (req, res) => {
  let connection;

  try {
    const {
      title, imageUrl, aspectRatio, postcardType,
      elements, canvasWidth, canvasHeight,
      imageOffsetX, imageOffsetY, imageScale, imageRotation,
      stampId, recipientInput, isPublic,
    } = req.body;

    if (!imageUrl) return error(res, '请上传明信片图片', 400);
    if (!stampId) return error(res, '请选择邮票', 400);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [ownedStamps] = await connection.query(
      'SELECT id, quantity FROM user_stamps WHERE user_id = ? AND stamp_id = ? FOR UPDATE',
      [req.user.id, stampId]
    );

    if (ownedStamps.length === 0) {
      await connection.rollback();
      return error(res, '你还没有这张邮票', 400);
    }

    const currentQuantity = Number(ownedStamps[0].quantity || 0);
    if (currentQuantity <= 0) {
      await connection.rollback();
      return error(res, '这张邮票已经没有剩余了', 400);
    }

    const rawRecipientInput = String(recipientInput || '').trim();
    let normalizedRecipientInput = rawRecipientInput;

    if ((postcardType || 'normal') === 'normal') {
      if (!rawRecipientInput) {
        await connection.rollback();
        return error(res, '请填写收件人UID或邮箱', 400);
      }

      const [recipientUsers] = await connection.query(
        'SELECT id, uid FROM users WHERE uid = ? OR email = ? LIMIT 1',
        [rawRecipientInput, rawRecipientInput]
      );

      if (recipientUsers.length === 0) {
        await connection.rollback();
        return error(res, '收件人不存在，请检查UID或邮箱', 404);
      }

      if (Number(recipientUsers[0].id) === Number(req.user.id)) {
        await connection.rollback();
        return error(res, '不能给自己发送明信片', 400);
      }

      normalizedRecipientInput = recipientUsers[0].uid;
    }

    if (currentQuantity === 1) {
      await connection.query(
        'DELETE FROM user_stamps WHERE id = ?',
        [ownedStamps[0].id]
      );
    } else {
      await connection.query(
        'UPDATE user_stamps SET quantity = quantity - 1 WHERE id = ?',
        [ownedStamps[0].id]
      );
    }

    const [result] = await connection.query(
      `INSERT INTO postcards
       (user_id, title, image_url, aspect_ratio, postcard_type,
        elements, canvas_width, canvas_height,
        image_offset_x, image_offset_y, image_scale, image_rotation,
        stamp_id, recipient_input, is_public, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'reviewing')`,
      [
        req.user.id,
        title || '',
        imageUrl,
        aspectRatio || '3/2',
        postcardType || 'normal',
        JSON.stringify(elements || []),
        canvasWidth || 600,
        canvasHeight || 400,
        imageOffsetX || 0, imageOffsetY || 0,
        imageScale || 1, imageRotation || 0,
        stampId,
        normalizedRecipientInput || '',
        isPublic ? 1 : 0,
      ]
    );

    await connection.query(
      'UPDATE users SET coins = coins + 20 WHERE id = ?',
      [req.user.id]
    );

    await connection.commit();

    // Trigger AI moderation asynchronously (don't await — user shouldn't wait)
    const postcardId = result.insertId;
    moderatePostcard(postcardId).catch(err => {
      console.error('Async moderation error for postcard', postcardId, err);
    });

    return success(res, {
      id: postcardId,
      remainingStampQuantity: currentQuantity - 1,
    }, '明信片发送成功，正在审核中', 201);
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('创建明信片错误:', err);
    return error(res, '创建失败');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 删除明信片
 * DELETE /api/postcards/:id
 */
const deletePostcard = async (req, res) => {
  let connection;

  try {
    await ensurePostcardDeleteColumns();

    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [userRows] = await connection.query('SELECT uid FROM users WHERE id = ?', [req.user.id]);
    const userUid = userRows[0]?.uid;

    const [rows] = await connection.query(
      'SELECT id, user_id, recipient_input FROM postcards WHERE id = ? FOR UPDATE',
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return error(res, '明信片不存在', 404);
    }

    const postcard = rows[0];
    const isSender = Number(postcard.user_id) === Number(req.user.id);
    const isRecipient = postcard.recipient_input && postcard.recipient_input === userUid;

    if (!isSender && !isRecipient) {
      await connection.rollback();
      return error(res, '无权限删除', 403);
    }

    if (isSender) {
      await connection.query('UPDATE postcards SET sender_deleted = 1 WHERE id = ?', [id]);
    }

    if (isRecipient) {
      await connection.query('UPDATE postcards SET recipient_deleted = 1 WHERE id = ?', [id]);
    }

    await cleanupPostcardsIfFullyDeleted(connection, [id]);
    await connection.commit();

    return success(res, null, '删除成功');
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('删除明信片错误:', err);
    return error(res, '删除失败');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 批量删除
 * DELETE /api/postcards/batch
 */
const batchDelete = async (req, res) => {
  let connection;

  try {
    await ensurePostcardDeleteColumns();

    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return error(res, '请提供要删除的明信片ID列表', 400);
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [userRows] = await connection.query('SELECT uid FROM users WHERE id = ?', [req.user.id]);
    const userUid = userRows[0]?.uid;
    const placeholders = ids.map(() => '?').join(',');

    const [rows] = await connection.query(
      `SELECT id, user_id, recipient_input FROM postcards WHERE id IN (${placeholders}) FOR UPDATE`,
      ids
    );

    const deletableIds = [];
    for (const postcard of rows) {
      const isSender = Number(postcard.user_id) === Number(req.user.id);
      const isRecipient = postcard.recipient_input && postcard.recipient_input === userUid;

      if (!isSender && !isRecipient) continue;

      deletableIds.push(postcard.id);

      if (isSender) {
        await connection.query('UPDATE postcards SET sender_deleted = 1 WHERE id = ?', [postcard.id]);
      }

      if (isRecipient) {
        await connection.query('UPDATE postcards SET recipient_deleted = 1 WHERE id = ?', [postcard.id]);
      }
    }

    await cleanupPostcardsIfFullyDeleted(connection, deletableIds);
    await connection.commit();

    return success(res, null, '批量删除成功');
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('批量删除错误:', err);
    return error(res, '批量删除失败');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 我的收件箱
 * GET /api/postcards/my/inbox?page=1&pageSize=20
 */
const getInbox = async (req, res) => {
  try {
    await ensurePostcardDeleteColumns();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    // 获取当前用户的 UID
    const [userRows] = await pool.query('SELECT uid FROM users WHERE id = ?', [req.user.id]);
    const userUid = userRows[0]?.uid;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM postcards
       WHERE recipient_input = ? AND status = 'sent' AND recipient_deleted = 0`,
      [userUid]
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.image_url, p.aspect_ratio, p.postcard_type,
              p.elements, p.canvas_width, p.canvas_height,
              p.image_offset_x, p.image_offset_y, p.image_scale, p.image_rotation,
              p.stamp_id, p.created_at,
              u.uid as author_uid, u.username as author_name, u.avatar as author_avatar,
              s.title as stamp_title, s.image_path as stamp_image,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM postcards p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN stamps s ON p.stamp_id = s.id
       WHERE p.recipient_input = ? AND p.status = 'sent' AND p.recipient_deleted = 0
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [userUid, pageSize, offset]
    );

    const list = rows.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      postcardType: r.postcard_type,
      elements: typeof r.elements === 'string' ? JSON.parse(r.elements || '[]') : (r.elements || []),
      canvasWidth: r.canvas_width,
      canvasHeight: r.canvas_height,
      imageOffset: { x: r.image_offset_x || 0, y: r.image_offset_y || 0 },
      imageScale: r.image_scale || 1,
      imageRotation: r.image_rotation || 0,
      stamp: r.stamp_id ? { title: r.stamp_title, image: r.stamp_image } : null,
      createdAt: r.created_at,
      author: { uid: r.author_uid, username: r.author_name, avatar: r.author_avatar },
      likeCount: r.like_count,
    }));

    return paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取收件箱错误:', err);
    return error(res, '获取收件箱失败');
  }
};

/**
 * 我的发件箱
 * GET /api/postcards/my/outbox?page=1&pageSize=20
 */
const getOutbox = async (req, res) => {
  try {
    await ensurePostcardDeleteColumns();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM postcards WHERE user_id = ? AND sender_deleted = 0',
      [req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.image_url, p.aspect_ratio, p.postcard_type,
              p.elements, p.canvas_width, p.canvas_height,
              p.image_offset_x, p.image_offset_y, p.image_scale, p.image_rotation,
              p.stamp_id, p.recipient_input, p.is_public, p.status, p.created_at,
              s.title as stamp_title, s.image_path as stamp_image,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM postcards p
       LEFT JOIN stamps s ON p.stamp_id = s.id
       WHERE p.user_id = ? AND p.sender_deleted = 0
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, pageSize, offset]
    );

    const list = rows.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      postcardType: r.postcard_type,
      elements: typeof r.elements === 'string' ? JSON.parse(r.elements || '[]') : (r.elements || []),
      canvasWidth: r.canvas_width,
      canvasHeight: r.canvas_height,
      imageOffset: { x: r.image_offset_x || 0, y: r.image_offset_y || 0 },
      imageScale: r.image_scale || 1,
      imageRotation: r.image_rotation || 0,
      stamp: r.stamp_id ? { title: r.stamp_title, image: r.stamp_image } : null,
      recipientInput: r.recipient_input,
      isPublic: !!r.is_public,
      status: r.status,
      createdAt: r.created_at,
      likeCount: r.like_count,
    }));

    return paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取发件箱错误:', err);
    return error(res, '获取发件箱失败');
  }
};

/**
 * 点赞/取消点赞
 * POST /api/postcards/:id/like
 */
const toggleLike = async (req, res) => {
  try {
    const postcardId = req.params.id;

    // 检查明信片是否存在
    const [pRows] = await pool.query('SELECT id FROM postcards WHERE id = ?', [postcardId]);
    if (pRows.length === 0) return error(res, '明信片不存在', 404);

    // 检查是否已点赞
    const [liked] = await pool.query(
      'SELECT id FROM likes WHERE user_id = ? AND postcard_id = ?',
      [req.user.id, postcardId]
    );

    if (liked.length > 0) {
      // 取消点赞
      await pool.query('DELETE FROM likes WHERE user_id = ? AND postcard_id = ?', [req.user.id, postcardId]);
      const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM likes WHERE postcard_id = ?', [postcardId]);
      return success(res, { isLiked: false, likeCount: count }, '已取消喜欢');
    } else {
      // 点赞
      await pool.query(
        'INSERT INTO likes (user_id, postcard_id) VALUES (?, ?)',
        [req.user.id, postcardId]
      );
      const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM likes WHERE postcard_id = ?', [postcardId]);
      return success(res, { isLiked: true, likeCount: count }, '已添加喜欢');
    }
  } catch (err) {
    console.error('点赞错误:', err);
    return error(res, '操作失败');
  }
};

/**
 * 我的收藏（已点赞的明信片）
 * GET /api/postcards/my/favorites?page=1&pageSize=20
 */
const getFavorites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM likes WHERE user_id = ?',
      [req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.image_url, p.aspect_ratio, p.created_at,
              u.username as author_name, u.avatar as author_avatar,
              (SELECT COUNT(*) FROM likes WHERE postcard_id = p.id) as like_count
       FROM likes l
       JOIN postcards p ON l.postcard_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE l.user_id = ?
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, pageSize, offset]
    );

    const list = rows.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image_url,
      aspectRatio: r.aspect_ratio,
      createdAt: r.created_at,
      author: { username: r.author_name, avatar: r.author_avatar },
      likeCount: r.like_count,
      isLiked: true,
    }));

    return paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取收藏列表错误:', err);
    return error(res, '获取收藏失败');
  }
};

/**
 * 上传明信片图片
 * POST /api/postcards/upload-image
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return error(res, '请上传图片', 400);
    const imageUrl = `/uploads/postcards/${req.file.filename}`;
    return success(res, { imageUrl }, '上传成功');
  } catch (err) {
    console.error('上传图片错误:', err);
    return error(res, '上传失败');
  }
};

/**
 * 添加漂流元素
 * PUT /api/postcards/:id/drift-element
 */
const addDriftElement = async (req, res) => {
  try {
    const { id } = req.params;
    const { element } = req.body;

    if (!element) return error(res, '请提供元素数据', 400);

    const [rows] = await pool.query(
      'SELECT elements, postcard_type, user_id FROM postcards WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return error(res, '明信片不存在', 404);
    if (rows[0].postcard_type !== 'drifting') return error(res, '此明信片不支持漂流操作', 400);

    let elements = typeof rows[0].elements === 'string'
      ? JSON.parse(rows[0].elements || '[]')
      : (rows[0].elements || []);

    // 检查该用户是否已添加过同类型元素
    const myElements = elements.filter(el => el.creatorId === req.user.id);
    const hasText = myElements.some(el => el.type === 'text');
    const hasSticker = myElements.some(el => el.type === 'sticker');

    if (element.type === 'text' && hasText) return error(res, '你已添加过文字元素', 400);
    if (element.type === 'sticker' && hasSticker) return error(res, '你已添加过贴纸元素', 400);

    // 添加创作者信息
    element.creatorId = req.user.id;
    element.creatorName = req.user.username;
    elements.push(element);

    await pool.query(
      'UPDATE postcards SET elements = ? WHERE id = ?',
      [JSON.stringify(elements), id]
    );

    return success(res, { elements }, '漂流元素添加成功');
  } catch (err) {
    console.error('添加漂流元素错误:', err);
    return error(res, '添加失败');
  }
};

/**
 * 删除漂流元素
 * DELETE /api/postcards/:id/drift-element/:idx
 */
const deleteDriftElement = async (req, res) => {
  try {
    const { id, idx } = req.params;
    const elementIdx = parseInt(idx);

    const [rows] = await pool.query(
      'SELECT elements, user_id FROM postcards WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return error(res, '明信片不存在', 404);

    let elements = typeof rows[0].elements === 'string'
      ? JSON.parse(rows[0].elements || '[]')
      : (rows[0].elements || []);

    if (elementIdx < 0 || elementIdx >= elements.length) {
      return error(res, '元素索引无效', 400);
    }

    const element = elements[elementIdx];
    const isOwner = rows[0].user_id === req.user.id;
    const isCreator = element.creatorId === req.user.id;

    if (!isOwner && !isCreator) {
      return error(res, '无权限删除该元素', 403);
    }

    elements.splice(elementIdx, 1);
    await pool.query(
      'UPDATE postcards SET elements = ? WHERE id = ?',
      [JSON.stringify(elements), id]
    );

    return success(res, { elements }, '元素已删除');
  } catch (err) {
    console.error('删除漂流元素错误:', err);
    return error(res, '删除失败');
  }
};

module.exports = {
  getDiscover,
  getDrifting,
  getDetail,
  create,
  deletePostcard,
  batchDelete,
  getInbox,
  getOutbox,
  toggleLike,
  getFavorites,
  uploadImage,
  addDriftElement,
  deleteDriftElement,
};
