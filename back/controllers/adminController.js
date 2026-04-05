const pool = require('../config/db');
const { success, error, paginate } = require('../utils/response');
const path = require('path');
const fs = require('fs');

const parsePage = (value, fallback = 1) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parsePageSize = (value, fallback = 10) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 100);
};

const normalizeBoolean = (value) => {
  if (value === true || value === 'true' || value === 1 || value === '1') return 1;
  return 0;
};

const normalizeOptionalNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeElements = (elements) => {
  if (elements === undefined || elements === null || elements === '') return JSON.stringify([]);
  if (typeof elements === 'string') {
    try {
      JSON.parse(elements);
      return elements;
    } catch (err) {
      throw new Error('元素 JSON 格式不正确');
    }
  }
  return JSON.stringify(elements);
};

const ensureUserExists = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
  return rows.length > 0;
};

const ensureStampExists = async (stampId) => {
  if (!stampId) return true;
  const [rows] = await pool.query('SELECT id FROM stamps WHERE id = ? LIMIT 1', [stampId]);
  return rows.length > 0;
};

const ensureSeriesExists = async (seriesName) => {
  const [rows] = await pool.query('SELECT id FROM stamp_series WHERE name = ? LIMIT 1', [seriesName]);
  return rows.length > 0;
};

const buildPostcardWhere = ({ keyword, postcardType, status }) => {
  const conditions = [];
  const params = [];

  if (keyword) {
    conditions.push(`(
      p.title LIKE ?
      OR p.recipient_input LIKE ?
      OR u.username LIKE ?
      OR u.uid LIKE ?
      OR CAST(p.id AS CHAR) LIKE ?
    )`);
    const fuzzy = `%${keyword}%`;
    params.push(fuzzy, fuzzy, fuzzy, fuzzy, fuzzy);
  }

  if (postcardType) {
    conditions.push('p.postcard_type = ?');
    params.push(postcardType);
  }

  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  return {
    whereSql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
};

const getOverview = async (req, res) => {
  try {
    const [userRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalUsers,
        SUM(CASE WHEN identity = 'admin' THEN 1 ELSE 0 END) AS totalAdmins
      FROM users
    `);
    const [postcardRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalPostcards,
        SUM(CASE WHEN postcard_type = 'drifting' THEN 1 ELSE 0 END) AS driftingPostcards
      FROM postcards
    `);
    const [stampRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalStamps,
        COUNT(DISTINCT series_id) AS totalSeries
      FROM stamps
    `);
    const [activationRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalActivationCodes,
        SUM(CASE WHEN status = 'unused' THEN 1 ELSE 0 END) AS unusedActivationCodes
      FROM vip_activation_codes
    `);

    return success(res, {
      totalUsers: Number(userRows?.[0]?.totalUsers || 0),
      totalAdmins: Number(userRows?.[0]?.totalAdmins || 0),
      totalPostcards: Number(postcardRows?.[0]?.totalPostcards || 0),
      driftingPostcards: Number(postcardRows?.[0]?.driftingPostcards || 0),
      totalStamps: Number(stampRows?.[0]?.totalStamps || 0),
      totalSeries: Number(stampRows?.[0]?.totalSeries || 0),
      totalActivationCodes: Number(activationRows?.[0]?.totalActivationCodes || 0),
      unusedActivationCodes: Number(activationRows?.[0]?.unusedActivationCodes || 0),
      pendingManualReview: 0,
    });
  } catch (err) {
    console.error('获取管理概览失败:', err);
    return error(res, '获取管理概览失败');
  }
};

const getAdminPostcards = async (req, res) => {
  try {
    const page = parsePage(req.query.page, 1);
    const pageSize = parsePageSize(req.query.pageSize, 10);
    const keyword = String(req.query.keyword || '').trim();
    const postcardType = String(req.query.postcardType || '').trim();
    const status = String(req.query.status || '').trim();

    const { whereSql, params } = buildPostcardWhere({ keyword, postcardType, status });
    const offset = (page - 1) * pageSize;

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM postcards p
       LEFT JOIN users u ON p.user_id = u.id
       ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.user_id, p.title, p.image_url, p.recipient_input, p.is_public, p.postcard_type,
              p.status, p.aspect_ratio, p.canvas_width, p.canvas_height, p.stamp_id, p.elements,
              p.created_at, p.sender_deleted, p.recipient_deleted,
              u.uid AS author_uid, u.username AS author_name,
              s.title AS stamp_title
       FROM postcards p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN stamps s ON p.stamp_id = s.id
       ${whereSql}
       ORDER BY p.created_at DESC, p.id DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const list = rows.map((item) => {
      let parsedElements = [];
      try {
        parsedElements = item.elements ? JSON.parse(item.elements) : [];
      } catch (err) {
        parsedElements = [];
      }

      return {
        id: item.id,
        userId: item.user_id,
        title: item.title,
        imageUrl: item.image_url,
        recipientInput: item.recipient_input,
        isPublic: !!item.is_public,
        postcardType: item.postcard_type,
        status: item.status,
        aspectRatio: item.aspect_ratio,
        canvasWidth: item.canvas_width,
        canvasHeight: item.canvas_height,
        stampId: item.stamp_id,
        stampTitle: item.stamp_title || '',
        authorUid: item.author_uid || '',
        authorName: item.author_name || '',
        elements: parsedElements,
        elementsRaw: item.elements || '[]',
        senderDeleted: !!item.sender_deleted,
        recipientDeleted: !!item.recipient_deleted,
        createdAt: item.created_at,
      };
    });

    return paginate(res, list, Number(countRows?.[0]?.total || 0), page, pageSize);
  } catch (err) {
    console.error('获取管理明信片列表失败:', err);
    return error(res, '获取明信片列表失败');
  }
};

const createAdminPostcard = async (req, res) => {
  try {
    const {
      userId,
      title = '',
      imageUrl,
      recipientInput = '',
      isPublic = 0,
      postcardType = 'normal',
      status = 'sent',
      aspectRatio = '3/2',
      canvasWidth = 600,
      canvasHeight = 400,
      stampId = null,
      elements = [],
    } = req.body;

    if (!userId || !imageUrl) {
      return error(res, '请填写用户 ID 与图片地址', 400);
    }

    if (!['normal', 'drifting'].includes(postcardType)) {
      return error(res, '无效的明信片类型', 400);
    }

    if (!['draft', 'sent'].includes(status)) {
      return error(res, '无效的明信片状态', 400);
    }

    if (!await ensureUserExists(userId)) {
      return error(res, '目标用户不存在', 404);
    }

    const normalizedStampId = normalizeOptionalNumber(stampId, null);
    if (normalizedStampId && !await ensureStampExists(normalizedStampId)) {
      return error(res, '关联邮票不存在', 404);
    }

    const elementsJson = normalizeElements(elements);

    const [result] = await pool.query(
      `INSERT INTO postcards (
        user_id, title, image_url, image_offset_x, image_offset_y, image_scale, image_rotation,
        aspect_ratio, canvas_width, canvas_height, stamp_id, recipient_input, is_public,
        postcard_type, elements, status
      ) VALUES (?, ?, ?, 0, 0, 1, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        imageUrl,
        aspectRatio,
        normalizeOptionalNumber(canvasWidth, 600),
        normalizeOptionalNumber(canvasHeight, 400),
        normalizedStampId,
        recipientInput,
        normalizeBoolean(isPublic),
        postcardType,
        elementsJson,
        status,
      ]
    );

    return success(res, { id: result.insertId }, '明信片创建成功');
  } catch (err) {
    console.error('管理员创建明信片失败:', err);
    return error(res, err.message || '创建明信片失败');
  }
};

const updateAdminPostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      title,
      imageUrl,
      recipientInput,
      isPublic,
      postcardType,
      status,
      aspectRatio,
      canvasWidth,
      canvasHeight,
      stampId,
      elements,
      senderDeleted,
      recipientDeleted,
    } = req.body;

    const [existsRows] = await pool.query('SELECT id FROM postcards WHERE id = ? LIMIT 1', [id]);
    if (existsRows.length === 0) {
      return error(res, '明信片不存在', 404);
    }

    const updates = [];
    const values = [];

    if (userId !== undefined) {
      if (!await ensureUserExists(userId)) {
        return error(res, '目标用户不存在', 404);
      }
      updates.push('user_id = ?');
      values.push(userId);
    }

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }

    if (imageUrl !== undefined) {
      updates.push('image_url = ?');
      values.push(imageUrl);
    }

    if (recipientInput !== undefined) {
      updates.push('recipient_input = ?');
      values.push(recipientInput);
    }

    if (isPublic !== undefined) {
      updates.push('is_public = ?');
      values.push(normalizeBoolean(isPublic));
    }

    if (postcardType !== undefined) {
      if (!['normal', 'drifting'].includes(postcardType)) {
        return error(res, '无效的明信片类型', 400);
      }
      updates.push('postcard_type = ?');
      values.push(postcardType);
    }

    if (status !== undefined) {
      if (!['draft', 'sent'].includes(status)) {
        return error(res, '无效的明信片状态', 400);
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (aspectRatio !== undefined) {
      updates.push('aspect_ratio = ?');
      values.push(aspectRatio);
    }

    if (canvasWidth !== undefined) {
      updates.push('canvas_width = ?');
      values.push(normalizeOptionalNumber(canvasWidth, 600));
    }

    if (canvasHeight !== undefined) {
      updates.push('canvas_height = ?');
      values.push(normalizeOptionalNumber(canvasHeight, 400));
    }

    if (stampId !== undefined) {
      const normalizedStampId = normalizeOptionalNumber(stampId, null);
      if (normalizedStampId && !await ensureStampExists(normalizedStampId)) {
        return error(res, '关联邮票不存在', 404);
      }
      updates.push('stamp_id = ?');
      values.push(normalizedStampId);
    }

    if (elements !== undefined) {
      updates.push('elements = ?');
      values.push(normalizeElements(elements));
    }

    if (senderDeleted !== undefined) {
      updates.push('sender_deleted = ?');
      values.push(normalizeBoolean(senderDeleted));
    }

    if (recipientDeleted !== undefined) {
      updates.push('recipient_deleted = ?');
      values.push(normalizeBoolean(recipientDeleted));
    }

    if (updates.length === 0) {
      return error(res, '没有需要更新的字段', 400);
    }

    values.push(id);
    await pool.query(`UPDATE postcards SET ${updates.join(', ')} WHERE id = ?`, values);

    return success(res, null, '明信片更新成功');
  } catch (err) {
    console.error('管理员更新明信片失败:', err);
    return error(res, err.message || '更新明信片失败');
  }
};

const deleteAdminPostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM postcards WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return error(res, '明信片不存在', 404);
    }

    return success(res, null, '明信片删除成功');
  } catch (err) {
    console.error('管理员删除明信片失败:', err);
    return error(res, '删除明信片失败');
  }
};

const getStampSeries = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ss.id, ss.name, ss.folder_name, ss.description, ss.sort_order, ss.created_at,
             COUNT(s.id) AS stamp_count
      FROM stamp_series ss
      LEFT JOIN stamps s ON s.series_id = ss.name
      GROUP BY ss.id, ss.name, ss.folder_name, ss.description, ss.sort_order, ss.created_at
      ORDER BY ss.sort_order ASC, ss.id ASC
    `);

    return success(res, rows.map((item) => ({
      id: item.id,
      name: item.name,
      folderName: item.folder_name || null,
      description: item.description,
      sortOrder: Number(item.sort_order || 0),
      stampCount: Number(item.stamp_count || 0),
      createdAt: item.created_at,
    })));
  } catch (err) {
    console.error('获取邮票系列失败:', err);
    return error(res, '获取邮票系列失败');
  }
};

const createStampSeries = async (req, res) => {
  try {
    const { name, description = '', sortOrder = 0, folderName = '' } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedFolder = String(folderName || '').trim().toLowerCase();

    if (!normalizedName) {
      return error(res, '请输入系列名称', 400);
    }

    if (normalizedFolder && !/^[a-z0-9_-]+$/.test(normalizedFolder)) {
      return error(res, '文件夹名只能包含小写字母、数字、下划线和连字符', 400);
    }

    // Create folder under res/stamps/systemstamps/ if folderName provided
    if (normalizedFolder) {
      const folderPath = path.join(__dirname, '..', 'res', 'stamps', 'systemstamps', normalizedFolder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    }

    await pool.query(
      'INSERT INTO stamp_series (name, folder_name, description, sort_order) VALUES (?, ?, ?, ?)',
      [normalizedName, normalizedFolder || null, description, normalizeOptionalNumber(sortOrder, 0)]
    );

    return success(res, null, '邮票系列创建成功');
  } catch (err) {
    console.error('创建邮票系列失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, '系列名称已存在', 409);
    }
    return error(res, '创建邮票系列失败');
  }
};

const updateStampSeries = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { name, description, sortOrder } = req.body;

    const [seriesRows] = await connection.query('SELECT id, name FROM stamp_series WHERE id = ? LIMIT 1', [id]);
    if (seriesRows.length === 0) {
      return error(res, '系列不存在', 404);
    }

    const currentSeries = seriesRows[0];
    const nextName = name !== undefined ? String(name).trim() : currentSeries.name;
    if (!nextName) {
      return error(res, '系列名称不能为空', 400);
    }

    await connection.beginTransaction();

    await connection.query(
      'UPDATE stamp_series SET name = ?, description = ?, sort_order = ? WHERE id = ?',
      [
        nextName,
        description !== undefined ? description : '',
        normalizeOptionalNumber(sortOrder, 0),
        id,
      ]
    );

    if (nextName !== currentSeries.name) {
      await connection.query('UPDATE stamps SET series_id = ? WHERE series_id = ?', [nextName, currentSeries.name]);
    }

    await connection.commit();
    return success(res, null, '邮票系列更新成功');
  } catch (err) {
    await connection.rollback();
    console.error('更新邮票系列失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, '系列名称已存在', 409);
    }
    return error(res, '更新邮票系列失败');
  } finally {
    connection.release();
  }
};

const deleteStampSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const [seriesRows] = await pool.query('SELECT id, name, folder_name FROM stamp_series WHERE id = ? LIMIT 1', [id]);
    if (seriesRows.length === 0) {
      return error(res, '系列不存在', 404);
    }

    const seriesName = seriesRows[0].name;
    const folderName = seriesRows[0].folder_name;
    const [stampRows] = await pool.query('SELECT COUNT(*) AS total FROM stamps WHERE series_id = ?', [seriesName]);
    if (Number(stampRows?.[0]?.total || 0) > 0) {
      return error(res, '请先删除该系列下的邮票', 400);
    }

    await pool.query('DELETE FROM stamp_series WHERE id = ?', [id]);

    // Delete the series folder under res/stamps/systemstamps/ if it exists
    if (folderName) {
      const folderPath = path.join(__dirname, '..', 'res', 'stamps', 'systemstamps', folderName);
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
      }
    }

    return success(res, null, '邮票系列删除成功');
  } catch (err) {
    console.error('删除邮票系列失败:', err);
    return error(res, '删除邮票系列失败');
  }
};

const getAdminStamps = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || '').trim();
    const seriesId = String(req.query.seriesId || '').trim();
    const conditions = [];
    const params = [];

    if (keyword) {
      const fuzzy = `%${keyword}%`;
      conditions.push('(title LIKE ? OR description LIKE ? OR series_id LIKE ?)');
      params.push(fuzzy, fuzzy, fuzzy);
    }

    if (seriesId) {
      conditions.push('series_id = ?');
      params.push(seriesId);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT id, series_id, title, description, price, image_path, created_at
       FROM stamps
       ${whereSql}
       ORDER BY series_id ASC, id DESC`,
      params
    );

    return success(res, rows.map((item) => ({
      id: item.id,
      seriesId: item.series_id,
      title: item.title,
      description: item.description,
      price: Number(item.price || 0),
      imagePath: item.image_path,
      createdAt: item.created_at,
    })));
  } catch (err) {
    console.error('获取邮票列表失败:', err);
    return error(res, '获取邮票列表失败');
  }
};

const createAdminStamp = async (req, res) => {
  try {
    const { seriesId, title, description = '', price = 5, imagePath } = req.body;
    const normalizedSeriesId = String(seriesId || '').trim();
    const normalizedTitle = String(title || '').trim();
    const normalizedImagePath = String(imagePath || '').trim();

    if (!normalizedSeriesId || !normalizedTitle || !normalizedImagePath) {
      return error(res, '请填写完整的邮票信息', 400);
    }

    if (!await ensureSeriesExists(normalizedSeriesId)) {
      return error(res, '所属系列不存在', 404);
    }

    await pool.query(
      'INSERT INTO stamps (series_id, title, description, price, image_path) VALUES (?, ?, ?, ?, ?)',
      [normalizedSeriesId, normalizedTitle, description, normalizeOptionalNumber(price, 5), normalizedImagePath]
    );

    return success(res, null, '邮票创建成功');
  } catch (err) {
    console.error('创建邮票失败:', err);
    return error(res, '创建邮票失败');
  }
};

const updateAdminStamp = async (req, res) => {
  try {
    const { id } = req.params;
    const { seriesId, title, description, price, imagePath } = req.body;

    const [stampRows] = await pool.query('SELECT id FROM stamps WHERE id = ? LIMIT 1', [id]);
    if (stampRows.length === 0) {
      return error(res, '邮票不存在', 404);
    }

    const updates = [];
    const values = [];

    if (seriesId !== undefined) {
      const normalizedSeriesId = String(seriesId || '').trim();
      if (!normalizedSeriesId) {
        return error(res, '系列名称不能为空', 400);
      }
      if (!await ensureSeriesExists(normalizedSeriesId)) {
        return error(res, '所属系列不存在', 404);
      }
      updates.push('series_id = ?');
      values.push(normalizedSeriesId);
    }

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(String(title || '').trim());
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (price !== undefined) {
      updates.push('price = ?');
      values.push(normalizeOptionalNumber(price, 5));
    }

    if (imagePath !== undefined) {
      updates.push('image_path = ?');
      values.push(String(imagePath || '').trim());
    }

    if (updates.length === 0) {
      return error(res, '没有需要更新的字段', 400);
    }

    values.push(id);
    await pool.query(`UPDATE stamps SET ${updates.join(', ')} WHERE id = ?`, values);

    return success(res, null, '邮票更新成功');
  } catch (err) {
    console.error('更新邮票失败:', err);
    return error(res, '更新邮票失败');
  }
};

const deleteAdminStamp = async (req, res) => {
  try {
    const { id } = req.params;
    const [stampRows] = await pool.query('SELECT image_path FROM stamps WHERE id = ? LIMIT 1', [id]);

    if (stampRows.length === 0) {
      return error(res, '邮票不存在', 404);
    }

    const imagePath = stampRows[0].image_path;
    const [result] = await pool.query('DELETE FROM stamps WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return error(res, '邮票不存在', 404);
    }

    // Delete image file — only local files under /uploads/ or /res/
    if (imagePath && (imagePath.startsWith('/uploads/') || imagePath.startsWith('/res/'))) {
      const absPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    return success(res, null, '邮票删除成功');
  } catch (err) {
    console.error('删除邮票失败:', err);
    return error(res, '删除邮票失败');
  }
};

const uploadAdminStampImage = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, '请上传邮票图片', 400);
    }

    const seriesName = String(req.body.seriesName || '').trim();

    if (seriesName) {
      // Look up the series folder_name
      const [seriesRows] = await pool.query(
        'SELECT folder_name FROM stamp_series WHERE name = ? LIMIT 1',
        [seriesName]
      );
      const folderName = seriesRows?.[0]?.folder_name;

      if (folderName) {
        const ext = path.extname(req.file.originalname);
        const baseName = path.basename(req.file.originalname, ext);
        const destDir = path.join(__dirname, '..', 'res', 'stamps', 'systemstamps', folderName);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Avoid filename collisions by appending a suffix if needed
        let destFilename = `${baseName}${ext}`;
        let destPath = path.join(destDir, destFilename);
        if (fs.existsSync(destPath)) {
          destFilename = `${baseName}_${Date.now()}${ext}`;
          destPath = path.join(destDir, destFilename);
        }

        fs.renameSync(req.file.path, destPath);

        return success(res, {
          imagePath: `/res/stamps/systemstamps/${folderName}/${destFilename}`,
        }, '邮票图片上传成功');
      }
    }

    return success(res, {
      imagePath: `/uploads/stamps/${req.file.filename}`,
    }, '邮票图片上传成功');
  } catch (err) {
    console.error('上传邮票图片失败:', err);
    return error(res, '上传邮票图片失败');
  }
};

const generateRandomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'VIP-';
  for (let i = 0; i < 12; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3 || i === 7) result += '-';
  }
  return result;
};

const createUniqueActivationCode = async () => {
  let code = generateRandomCode();
  let exists = true;

  while (exists) {
    const [rows] = await pool.query('SELECT id FROM vip_activation_codes WHERE code = ? LIMIT 1', [code]);
    exists = rows.length > 0;
    if (exists) {
      code = generateRandomCode();
    }
  }

  return code;
};

const getActivationCodes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT vac.id, vac.code, vac.vip_level, vac.valid_days, vac.status, vac.note, vac.used_at, vac.created_at,
             creator.username AS created_by_name, user_used.username AS used_by_name
      FROM vip_activation_codes vac
      LEFT JOIN users creator ON vac.created_by = creator.id
      LEFT JOIN users user_used ON vac.used_by = user_used.id
      ORDER BY vac.created_at DESC, vac.id DESC
    `);

    return success(res, rows.map((item) => ({
      id: item.id,
      code: item.code,
      vipLevel: item.vip_level,
      validDays: Number(item.valid_days || 0),
      status: item.status,
      note: item.note,
      usedAt: item.used_at,
      createdAt: item.created_at,
      createdByName: item.created_by_name || '',
      usedByName: item.used_by_name || '',
    })));
  } catch (err) {
    console.error('获取激活码列表失败:', err);
    return error(res, '获取激活码列表失败');
  }
};

const generateActivationCodes = async (req, res) => {
  try {
    const quantity = Math.min(parsePageSize(req.body.quantity, 10), 50);
    const vipLevel = String(req.body.vipLevel || 'VIP 1').trim();
    const validDays = parsePage(req.body.validDays, 30);
    const note = String(req.body.note || '').trim();

    const values = [];
    for (let i = 0; i < quantity; i += 1) {
      const code = await createUniqueActivationCode();
      values.push([code, vipLevel, validDays, note, req.user.id]);
    }

    await pool.query(
      'INSERT INTO vip_activation_codes (code, vip_level, valid_days, note, created_by) VALUES ?',
      [values]
    );

    return success(res, { count: quantity }, `成功生成 ${quantity} 个会员激活码`);
  } catch (err) {
    console.error('生成激活码失败:', err);
    return error(res, '生成激活码失败');
  }
};

const deleteActivationCode = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM vip_activation_codes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return error(res, '激活码不存在', 404);
    }

    return success(res, null, '激活码删除成功');
  } catch (err) {
    console.error('删除激活码失败:', err);
    return error(res, '删除激活码失败');
  }
};

// ==================== 审核相关 ====================

const getPendingPostcards = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.user_id, p.title, p.image_url, p.aspect_ratio, p.postcard_type,
             p.elements, p.canvas_width, p.canvas_height,
             p.image_offset_x, p.image_offset_y, p.image_scale, p.image_rotation,
             p.stamp_id, p.recipient_input, p.is_public, p.status, p.review_reason,
             p.created_at,
             u.username AS author_name, u.uid AS author_uid,
             s.image_path AS stamp_image, s.title AS stamp_title
      FROM postcards p
      LEFT JOIN users u ON u.id = p.user_id
      LEFT JOIN stamps s ON s.id = p.stamp_id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
    `);

    return success(res, rows.map(r => ({
      id: r.id,
      userId: r.user_id,
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
      stamp: r.stamp_image ? { image: r.stamp_image, title: r.stamp_title } : null,
      recipientInput: r.recipient_input,
      isPublic: !!r.is_public,
      status: r.status,
      reviewReason: r.review_reason,
      authorName: r.author_name,
      authorUid: r.author_uid,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error('获取待审核列表失败:', err);
    return error(res, '获取待审核列表失败');
  }
};

const approvePostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, user_id, title, status FROM postcards WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return error(res, '明信片不存在', 404);
    if (rows[0].status !== 'pending') return error(res, '该明信片不在待审核状态', 400);

    await pool.query("UPDATE postcards SET status = 'sent', review_reason = NULL WHERE id = ?", [id]);

    return success(res, null, '审核通过');
  } catch (err) {
    console.error('审核通过失败:', err);
    return error(res, '操作失败');
  }
};

const rejectPostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = '内容不符合社区规范' } = req.body;

    const [rows] = await pool.query('SELECT id, user_id, title, status FROM postcards WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return error(res, '明信片不存在', 404);
    if (rows[0].status !== 'pending') return error(res, '该明信片不在待审核状态', 400);

    await pool.query("UPDATE postcards SET status = 'rejected', review_reason = ? WHERE id = ?", [reason, id]);

    // Notify user
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, content, postcard_id)
       VALUES (?, 'review', '明信片审核未通过', ?, ?)`,
      [
        rows[0].user_id,
        `您的明信片"${rows[0].title || '未命名'}"审核未通过，原因：${reason}`,
        id,
      ]
    );

    return success(res, null, '已驳回');
  } catch (err) {
    console.error('驳回失败:', err);
    return error(res, '操作失败');
  }
};

module.exports = {
  getOverview,
  getAdminPostcards,
  createAdminPostcard,
  updateAdminPostcard,
  deleteAdminPostcard,
  getStampSeries,
  createStampSeries,
  updateStampSeries,
  deleteStampSeries,
  getAdminStamps,
  createAdminStamp,
  updateAdminStamp,
  deleteAdminStamp,
  uploadAdminStampImage,
  getActivationCodes,
  generateActivationCodes,
  deleteActivationCode,
  getPendingPostcards,
  approvePostcard,
  rejectPostcard,
};
