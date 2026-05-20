const pool = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * 获取邮票系列
 * GET /api/stamps/series
 */
const getStampSeries = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, description, sort_order
      FROM stamp_series
      ORDER BY sort_order ASC, id ASC
    `);

    return success(res, rows.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      sortOrder: Number(item.sort_order || 0),
    })));
  } catch (err) {
    console.error('获取邮票系列错误:', err);
    return error(res, '获取邮票系列失败');
  }
};

/**
 * 获取所有邮票（支持分类筛选）
 * GET /api/stamps?category=全部
 */
const getStamps = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM stamps ORDER BY series_id, id';
    let params = [];

    if (category && category !== '全部') {
      query = 'SELECT * FROM stamps WHERE series_id = ? ORDER BY id';
      params = [category];
    }

    const [rows] = await pool.query(query, params);

    let ownedMap = new Map();
    if (req.user?.id) {
      const [ownedRows] = await pool.query(
        `SELECT stamp_id, quantity, purchased_at,
                DATE(purchased_at) = CURDATE() AS purchased_today
         FROM user_stamps WHERE user_id = ?`,
        [req.user.id]
      );
      ownedMap = new Map(ownedRows.map((item) => [item.stamp_id, item]));
    }

    const list = rows.map((s) => {
      const owned = ownedMap.get(s.id);
      const ownedQuantity = owned ? Number(owned.quantity || 0) : 0;
      const purchasedToday = owned ? !!owned.purchased_today : false;

      return {
        id: s.id,
        seriesId: s.series_id,
        title: s.title,
        desc: s.description,
        price: s.price,
        image: s.image_path,
        dailyLimit: 1,
        ownedQuantity,
        purchasedToday,
        canPurchaseToday: !purchasedToday,
      };
    });

    return success(res, list);
  } catch (err) {
    console.error('获取邮票列表错误:', err);
    return error(res, '获取邮票列表失败');
  }
};

/**
 * 我的邮票
 * GET /api/stamps/my
 */
const getMyStamps = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.series_id, s.title, s.description, s.price, s.image_path, us.quantity, us.purchased_at
       FROM user_stamps us
       JOIN stamps s ON us.stamp_id = s.id
       WHERE us.user_id = ? AND us.quantity > 0
       ORDER BY us.purchased_at DESC, s.id ASC`,
      [req.user.id]
    );

    const list = rows.map((s) => ({
      id: s.id,
      seriesId: s.series_id,
      title: s.title,
      desc: s.description,
      price: s.price,
      image: s.image_path,
      quantity: Number(s.quantity || 0),
      purchasedAt: s.purchased_at,
    }));

    return success(res, list);
  } catch (err) {
    console.error('获取我的邮票错误:', err);
    return error(res, '获取我的邮票失败');
  }
};

/**
 * 购买邮票
 * POST /api/stamps/purchase
 */
const purchaseStamp = async (req, res) => {
  let connection;

  try {
    const { stampId } = req.body;

    if (!stampId) return error(res, '请提供邮票ID', 400);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [stamps] = await connection.query(
      'SELECT id, title, image_path, price FROM stamps WHERE id = ? FOR UPDATE',
      [stampId]
    );
    if (stamps.length === 0) {
      await connection.rollback();
      return error(res, '邮票不存在', 404);
    }

    const stamp = stamps[0];

    const [users] = await connection.query(
      'SELECT coins FROM users WHERE id = ? FOR UPDATE',
      [req.user.id]
    );
    if (users.length === 0) {
      await connection.rollback();
      return error(res, '用户不存在', 404);
    }

    if (Number(users[0].coins || 0) < Number(stamp.price || 0)) {
      await connection.rollback();
      return error(res, '邮分余额不足', 400);
    }

    const [owned] = await connection.query(
      'SELECT id, quantity, purchased_at, DATE(purchased_at) = CURDATE() AS purchased_today FROM user_stamps WHERE user_id = ? AND stamp_id = ? FOR UPDATE',
      [req.user.id, stampId]
    );

    if (owned.length > 0 && owned[0].purchased_today) {
      await connection.rollback();
      return error(res, '这张邮票今天已经购买过了', 409);
    }

    await connection.query(
      'UPDATE users SET coins = coins - ? WHERE id = ?',
      [stamp.price, req.user.id]
    );

    let nextQuantity = 1;
    if (owned.length > 0) {
      nextQuantity = Number(owned[0].quantity || 0) + 1;
      await connection.query(
        'UPDATE user_stamps SET quantity = ?, purchased_at = NOW() WHERE id = ?',
        [nextQuantity, owned[0].id]
      );
    } else {
      await connection.query(
        'INSERT INTO user_stamps (user_id, stamp_id, quantity, purchased_at) VALUES (?, ?, 1, NOW())',
        [req.user.id, stampId]
      );
    }

    await connection.commit();

    return success(res, {
      coins: Number(users[0].coins || 0) - Number(stamp.price || 0),
      dailyLimit: 1,
      purchasedToday: true,
      stamp: {
        id: stamp.id,
        title: stamp.title,
        image: stamp.image_path,
        quantity: nextQuantity,
      },
    }, '购买成功');
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('购买邮票错误:', err);
    return error(res, '购买失败');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { getStampSeries, getStamps, getMyStamps, purchaseStamp };
