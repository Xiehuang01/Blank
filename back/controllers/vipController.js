const axios = require('axios');
const pool = require('../config/db');
const { success, error } = require('../utils/response');
const {
  buildZpaySign,
  formatAmountFromCents,
  formatDateTime,
  grantVipByActivationCode,
  grantVipPlan,
  syncUserVipStatus,
} = require('../services/vipService');


const ZPAY_BASE_URL = process.env.ZPAY_BASE_URL ? String(process.env.ZPAY_BASE_URL).replace(/\/+$/, '') : '';
const ZPAY_PID = String(process.env.ZPAY_PID || '').trim();
const ZPAY_PKEY = String(process.env.ZPAY_PKEY || '').trim();
const ZPAY_DEFAULT_TYPE = String(process.env.ZPAY_DEFAULT_TYPE || 'alipay').trim();
const ZPAY_CID = String(process.env.ZPAY_CID || '').trim();

const SUPPORTED_PAYMENT_TYPES = new Set(['alipay', 'wxpay']);
const CANCELABLE_VIP_ORDER_STATUSES = new Set(['created', 'pending']);
const FINISHED_VIP_ORDER_STATUSES = new Set(['paid', 'failed', 'refunded', 'closed']);

const isZpayConfigured = () => Boolean(ZPAY_PID && ZPAY_PKEY && ZPAY_BASE_URL);


const formatOrderResponse = (row) => ({
  orderNo: row.order_no,
  tradeNo: row.zpay_trade_no || '',
  planKey: row.plan_key,
  planTitle: row.plan_title,
  amount: formatAmountFromCents(row.amount_cents),
  paymentType: row.payment_type,
  status: row.status,
  payUrl: row.pay_url || '',
  paidAt: formatDateTime(row.paid_at),
  createdAt: formatDateTime(row.created_at),
  updatedAt: formatDateTime(row.updated_at),
});

const normalizeBaseUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    return url.origin.replace(/\/+$/, '');
  } catch (_error) {
    return '';
  }
};

const isPrivateOrLoopbackHost = (hostname) => {
  const host = String(hostname || '').trim().toLowerCase();
  if (!host) return true;

  if (['localhost', '0.0.0.0', '::1', '[::1]'].includes(host)) {
    return true;
  }

  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return false;
  }

  const [a, b] = host.split('.').map((part) => Number(part));
  if (a === 10 || a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
};

const isPlaceholderHost = (hostname) => {
  const host = String(hostname || '').trim().toLowerCase();
  return ['yourdomain.com', 'www.yourdomain.com', 'example.com', 'www.example.com'].includes(host);
};

const pickBestBaseUrl = (candidates = []) => {
  const normalized = candidates
    .map((candidate) => normalizeBaseUrl(candidate))
    .filter(Boolean)
    .filter((candidate) => {
      try {
        return !isPlaceholderHost(new URL(candidate).hostname);
      } catch (_error) {
        return false;
      }
    });

  if (!normalized.length) {
    return '';
  }

  const publicUrl = normalized.find((candidate) => {
    try {
      return !isPrivateOrLoopbackHost(new URL(candidate).hostname);
    } catch (_error) {
      return false;
    }
  });

  return publicUrl || normalized[0];
};

const getRequestBaseUrl = (req) => {

  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
  const host = forwardedHost || req.get('host') || '';
  const protocol = forwardedProto || req.protocol || 'http';
  return host ? `${protocol}://${host}` : '';
};

const getFrontendBaseUrl = (req) => pickBestBaseUrl([
  process.env.APP_BASE_URL,
  req.headers.origin,
  getRequestBaseUrl(req),
]);

const getApiBaseUrl = (req) => pickBestBaseUrl([
  process.env.API_PUBLIC_BASE_URL,
  getRequestBaseUrl(req),
  getFrontendBaseUrl(req),
]);


const buildAbsoluteUrl = (base, path) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

const getClientIp = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const raw = forwarded || req.ip || req.socket?.remoteAddress || '';
  return raw.replace(/^::ffff:/, '');
};

const resolveDevice = (userAgent = '') => (/mobile|android|iphone|ipad|wechat/i.test(userAgent) ? 'mobile' : 'pc');

const generateOrderNo = () => `${Date.now()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`.slice(0, 32);

const getVipPlanByKey = async (planKey) => {
  const [rows] = await pool.query(
    `SELECT plan_key, title, billing_unit, price_cents, currency
     FROM vip_plans
     WHERE plan_key = ? AND is_active = 1
     LIMIT 1`,
    [planKey]
  );

  return rows[0] || null;
};

const getVipOrderByOrderNo = async (orderNo, userId = null) => {
  const params = [orderNo];
  let sql = `SELECT id, order_no, user_id, plan_key, plan_title, amount_cents, payment_type, status,
                    zpay_trade_no, pay_url, paid_at, created_at, updated_at
             FROM vip_orders
             WHERE order_no = ?`;

  if (userId !== null) {
    sql += ' AND user_id = ?';
    params.push(userId);
  }

  sql += ' LIMIT 1';
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
};

const markVipOrderPaid = async (connection, orderNo, payload = {}) => {
  const [orders] = await connection.query(
    `SELECT id, order_no, user_id, plan_key, plan_title, amount_cents, payment_type, status,
            zpay_trade_no, pay_url, paid_at, created_at, updated_at
     FROM vip_orders
     WHERE order_no = ?
     LIMIT 1
     FOR UPDATE`,
    [orderNo]
  );

  if (!orders.length) {
    throw new Error('支付订单不存在');
  }

  const order = orders[0];
  if (order.status === 'paid') {
    const vipSnapshot = await syncUserVipStatus(connection, order.user_id, { forUpdate: true });
    return {
      order: formatOrderResponse(order),
      vipSnapshot,
      alreadyPaid: true,
    };
  }

  const vipSnapshot = await grantVipPlan(connection, order.user_id, order.plan_key);
  const notifyRaw = payload.raw ? JSON.stringify(payload.raw) : null;
  const paidAt = payload.paidAt || new Date();

  await connection.query(
    `UPDATE vip_orders
     SET status = 'paid',
         zpay_trade_no = ?,
         payment_type = ?,
         notify_raw = COALESCE(?, notify_raw),
         paid_at = COALESCE(paid_at, ?),
         updated_at = NOW()
     WHERE id = ?`,
    [
      payload.tradeNo || order.zpay_trade_no || null,
      payload.paymentType || order.payment_type,
      notifyRaw,
      formatDateTime(paidAt),
      order.id,
    ]
  );

  const [freshRows] = await connection.query(
    `SELECT id, order_no, user_id, plan_key, plan_title, amount_cents, payment_type, status,
            zpay_trade_no, pay_url, paid_at, created_at, updated_at
     FROM vip_orders
     WHERE id = ?
     LIMIT 1`,
    [order.id]
  );

  return {
    order: formatOrderResponse(freshRows[0]),
    vipSnapshot,
    alreadyPaid: false,
  };
};

const syncVipOrderFromProvider = async (order) => {
  if (!order || FINISHED_VIP_ORDER_STATUSES.has(order.status) || !isZpayConfigured()) {
    return null;
  }


  try {
    const response = await axios.get(`${ZPAY_BASE_URL}/api.php`, {
      params: {
        act: 'order',
        pid: ZPAY_PID,
        key: ZPAY_PKEY,
        out_trade_no: order.order_no,
      },
      timeout: 8000,
    });

    const providerData = response.data || {};
    if (Number(providerData.code) !== 1) {
      return { paid: false, providerData };
    }

    if (providerData.trade_no && (providerData.trade_no !== order.zpay_trade_no || providerData.type !== order.payment_type)) {
      await pool.query(
        `UPDATE vip_orders
         SET zpay_trade_no = ?, payment_type = ?, updated_at = NOW()
         WHERE id = ?`,
        [providerData.trade_no || order.zpay_trade_no || null, providerData.type || order.payment_type, order.id]
      );
    }

    if (!isProviderPaidStatus(providerData.status)) {
      return { paid: false, providerData };
    }


    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const paidResult = await markVipOrderPaid(connection, order.order_no, {
        tradeNo: providerData.trade_no || '',
        paymentType: providerData.type || order.payment_type,
        raw: providerData,
        paidAt: providerData.endtime || new Date(),
      });
      await connection.commit();
      return {
        paid: true,
        providerData,
        ...paidResult,
      };
    } catch (syncError) {
      await connection.rollback();
      throw syncError;
    } finally {
      connection.release();
    }
  } catch (providerError) {
    console.warn('同步易支付订单状态失败:', providerError?.response?.data || providerError.message || providerError);
    return null;
  }
};

/**
 * 获取 VIP 订阅计划（价格从数据库读取）
 * GET /api/vip/plans
 */
const getVipPlans = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT plan_key, title, billing_unit, price_cents, currency
       FROM vip_plans
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`
    );

    const result = (rows || []).map((r) => ({
      planKey: r.plan_key,
      title: r.title,
      billingUnit: r.billing_unit,
      priceCents: Number(r.price_cents),
      currency: r.currency,
    }));

    return success(res, result);
  } catch (err) {
    console.error('获取 VIP 订阅计划失败:', err);
    return error(res, '获取VIP价格失败');
  }
};

/**
 * 创建 VIP 支付订单
 * POST /api/vip/payments/create
 */
const createVipPayment = async (req, res) => {
  try {
    if (!isZpayConfigured()) {
      return error(res, '易支付参数未配置，请先设置商户信息', 500);
    }

    const planKey = String(req.body.planKey || '').trim();
    const payType = String(req.body.payType || ZPAY_DEFAULT_TYPE || 'alipay').trim();

    if (!planKey) {
      return error(res, '请选择要开通的会员套餐', 400);
    }

    if (!SUPPORTED_PAYMENT_TYPES.has(payType)) {
      return error(res, '暂不支持该支付方式', 400);
    }

    const plan = await getVipPlanByKey(planKey);
    if (!plan) {
      return error(res, '会员套餐不存在或已下架', 404);
    }

    const currentVip = await syncUserVipStatus(pool, req.user.id);
    if (currentVip?.vipPlanKey === 'lifetime') {
      return error(res, '您已是终身会员，无需重复购买', 400);
    }

    const frontendBase = getFrontendBaseUrl(req);
    const apiBase = getApiBaseUrl(req);
    if (!frontendBase || !apiBase) {
      return error(res, '无法解析支付回跳地址，请配置站点公网地址', 500);
    }

    let apiHost = '';
    try {
      apiHost = new URL(apiBase).hostname;
    } catch (_error) {
      apiHost = '';
    }

    if (!apiHost || isPrivateOrLoopbackHost(apiHost) || isPlaceholderHost(apiHost)) {
      return error(res, '支付通知地址必须为公网可访问域名，请先配置 API_PUBLIC_BASE_URL', 500);
    }

    const orderNo = generateOrderNo();

    const amount = formatAmountFromCents(plan.price_cents);
    const notifyUrl = buildAbsoluteUrl(apiBase, '/api/vip/payments/notify');
    const returnUrl = buildAbsoluteUrl(frontendBase, '/vip');
    const name = `Blank${plan.title}订阅`;
    const param = `vip_${req.user.id}_${plan.plan_key}`;

    const formFields = {
      name,
      money: amount,
      type: payType,
      out_trade_no: orderNo,
      notify_url: notifyUrl,
      pid: ZPAY_PID,
      param,
      return_url: returnUrl,
    };

    if (ZPAY_CID) {
      formFields.cid = ZPAY_CID;
    }

    const sign = buildZpaySign(formFields, ZPAY_PKEY);
    formFields.sign = sign;
    formFields.sign_type = 'MD5';

    const payUrl = `${ZPAY_BASE_URL}/submit.php?${new URLSearchParams(formFields).toString()}`;

    await pool.query(
      `INSERT INTO vip_orders (
        order_no, user_id, plan_key, plan_title, amount_cents,
        payment_type, status, pay_url, request_ip, device
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        orderNo,
        req.user.id,
        plan.plan_key,
        plan.title,
        Number(plan.price_cents),
        payType,
        payUrl,
        getClientIp(req),
        resolveDevice(req.headers['user-agent'] || ''),
      ]
    );

    return success(res, {
      orderNo,
      planKey: plan.plan_key,
      planTitle: plan.title,
      amount,
      status: 'pending',
      gatewayUrl: `${ZPAY_BASE_URL}/submit.php`,
      formFields,
      payUrl,
    }, '支付订单创建成功');
  } catch (err) {
    console.error('创建VIP支付订单失败:', err);
    return error(res, '创建支付订单失败，请稍后重试');
  }
};

/**
 * 取消当前用户的待支付 VIP 订单
 * POST /api/vip/payments/:orderNo/cancel
 */
const cancelVipPayment = async (req, res) => {
  try {
    const orderNo = String(req.params.orderNo || '').trim();
    if (!orderNo) {
      return error(res, '缺少订单号', 400);
    }

    let order = await getVipOrderByOrderNo(orderNo, req.user.id);
    if (!order) {
      return error(res, '支付订单不存在', 404);
    }

    let vipSnapshot = await syncUserVipStatus(pool, req.user.id);

    if (!FINISHED_VIP_ORDER_STATUSES.has(order.status)) {
      const syncResult = await syncVipOrderFromProvider(order);
      if (syncResult?.paid) {
        order = await getVipOrderByOrderNo(orderNo, req.user.id);
        vipSnapshot = syncResult.vipSnapshot || vipSnapshot;
      } else if (syncResult?.providerData?.trade_no || syncResult?.providerData?.type) {
        order = await getVipOrderByOrderNo(orderNo, req.user.id);
      }
    }

    if (order.status === 'paid') {
      return error(res, '订单已支付，无法取消', 400);
    }

    if (order.status === 'closed') {
      return success(res, {
        order: formatOrderResponse(order),
        vip: vipSnapshot,
      }, '该订单已取消');
    }

    if (!CANCELABLE_VIP_ORDER_STATUSES.has(order.status)) {
      return error(res, '当前订单不可取消', 400);
    }

    await pool.query(
      `UPDATE vip_orders
       SET status = 'closed', updated_at = NOW()
       WHERE id = ? AND status IN ('created', 'pending')`,
      [order.id]
    );

    order = await getVipOrderByOrderNo(orderNo, req.user.id);

    return success(res, {
      order: order ? formatOrderResponse(order) : null,
      vip: vipSnapshot,
    }, '已取消当前待支付订单');
  } catch (err) {
    console.error('取消VIP支付订单失败:', err);
    return error(res, '取消待支付订单失败');
  }
};

/**
 * 获取当前用户最近一笔 VIP 支付订单
 * GET /api/vip/payments/latest
 */
const getLatestVipPayment = async (req, res) => {

  try {
    let vipSnapshot = await syncUserVipStatus(pool, req.user.id);
    const [rows] = await pool.query(
      `SELECT id, order_no, user_id, plan_key, plan_title, amount_cents, payment_type, status,
              zpay_trade_no, pay_url, paid_at, created_at, updated_at
       FROM vip_orders
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return success(res, {
        order: null,
        vip: vipSnapshot,
      });
    }

    let order = rows[0];

    if (order.status !== 'paid') {
      const syncResult = await syncVipOrderFromProvider(order);
      if (syncResult?.paid) {
        order = await getVipOrderByOrderNo(order.order_no, req.user.id);
        vipSnapshot = syncResult.vipSnapshot || vipSnapshot;
      } else if (syncResult?.providerData?.trade_no || syncResult?.providerData?.type) {
        order = await getVipOrderByOrderNo(order.order_no, req.user.id);
      }
    }

    return success(res, {
      order: order ? formatOrderResponse(order) : null,
      vip: vipSnapshot,
    });
  } catch (err) {
    console.error('获取最近VIP支付订单失败:', err);
    return error(res, '获取最近订单失败');
  }
};

/**
 * 查询 VIP 支付订单状态
 * GET /api/vip/payments/:orderNo
 */
const getVipPaymentStatus = async (req, res) => {

  try {
    const orderNo = String(req.params.orderNo || '').trim();
    if (!orderNo) {
      return error(res, '缺少订单号', 400);
    }

    const dbOrder = await getVipOrderByOrderNo(orderNo, req.user.id);
    if (!dbOrder) {
      return error(res, '支付订单不存在', 404);
    }

    let order = dbOrder;
    let vipSnapshot = await syncUserVipStatus(pool, req.user.id);

    if (order.status !== 'paid') {
      const syncResult = await syncVipOrderFromProvider(order);
      if (syncResult?.paid) {
        order = await getVipOrderByOrderNo(orderNo, req.user.id);
        vipSnapshot = syncResult.vipSnapshot || vipSnapshot;
      } else if (syncResult?.providerData?.trade_no || syncResult?.providerData?.type) {
        order = await getVipOrderByOrderNo(orderNo, req.user.id);
      }
    }

    return success(res, {
      ...formatOrderResponse(order),
      vip: vipSnapshot,
    });
  } catch (err) {
    console.error('查询VIP支付状态失败:', err);
    return error(res, '查询支付状态失败');
  }
};

/**
 * 易支付异步通知
 * GET/POST /api/vip/payments/notify
 */
const pickNotifyValue = (value) => {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }
  return value;
};

const normalizeNotifyPayload = (sources = []) => {
  const payload = {};

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;

    for (const [key, value] of Object.entries(source)) {
      const normalizedValue = pickNotifyValue(value);
      payload[key] = normalizedValue == null ? '' : String(normalizedValue);
    }
  }

  return payload;
};

const sendNotifyPlainText = (res, text = 'success') => {
  if (res.headersSent) {
    return res.end();
  }

  res.status(200);
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'no-store');
  return res.end(String(text));
};

const processVipPaymentNotify = async (payload) => {
  if (!isZpayConfigured()) {
    console.warn('易支付回调被忽略：商户参数未配置');
    return;
  }

  const orderNo = String(payload.out_trade_no || '').trim();
  const tradeStatus = String(payload.trade_status || '').trim();
  const sign = String(payload.sign || '').trim().toLowerCase();

  if (!orderNo || !sign) {
    console.warn('易支付回调缺少关键参数:', { orderNo, hasSign: Boolean(sign) });
    return;
  }

  const expectedSign = buildZpaySign(payload, ZPAY_PKEY);
  if (expectedSign !== sign) {
    console.warn('易支付回调签名校验失败:', { orderNo });
    return;
  }

  if (tradeStatus !== 'TRADE_SUCCESS') {
    console.warn('易支付回调状态非成功，已忽略:', { orderNo, tradeStatus });
    return;
  }

  const order = await getVipOrderByOrderNo(orderNo);
  if (!order) {
    console.warn('易支付回调未匹配到订单，已按成功响应避免重复通知:', { orderNo });
    return;
  }

  const localMoney = formatAmountFromCents(order.amount_cents);
  const notifyMoneyRaw = Number(payload.money);
  const notifyMoney = Number.isFinite(notifyMoneyRaw) ? notifyMoneyRaw.toFixed(2) : '';
  if (!notifyMoney || localMoney !== notifyMoney) {
    console.warn('易支付回调金额校验失败:', { orderNo, localMoney, notifyMoney: payload.money });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await markVipOrderPaid(connection, orderNo, {
      tradeNo: String(payload.trade_no || '').trim(),
      paymentType: String(payload.type || order.payment_type || '').trim() || order.payment_type,
      raw: payload,
    });
    await connection.commit();
  } catch (notifyError) {
    await connection.rollback();
    throw notifyError;
  } finally {
    connection.release();
  }
};

const handleVipPaymentNotify = (req, res) => {
  const payload = normalizeNotifyPayload([
    req.query || {},
    req.body || {},
  ]);

  sendNotifyPlainText(res, 'success');

  processVipPaymentNotify(payload).catch((err) => {
    console.error('处理VIP支付回调失败:', err);
  });
};


/**
 * 兑换 VIP 激活码
 * POST /api/vip/activation/redeem
 */
const redeemVipActivationCode = async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();

  if (!code) {
    return error(res, '请输入兑换码', 400);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id, code, vip_level, valid_days, status, used_by, used_at
       FROM vip_activation_codes
       WHERE code = ?
       LIMIT 1
       FOR UPDATE`,
      [code]
    );

    if (!rows.length) {
      await connection.rollback();
      return error(res, '兑换码不存在', 404);
    }

    const activationCode = rows[0];

    if (activationCode.status === 'disabled') {
      await connection.rollback();
      return error(res, '兑换码已失效', 400);
    }

    if (activationCode.status === 'used') {
      await connection.rollback();
      return error(res, '兑换码已被使用', 400);
    }

    const vipSnapshot = await grantVipByActivationCode(connection, req.user.id, activationCode);

    await connection.query(
      `UPDATE vip_activation_codes
       SET status = 'used',
           used_by = ?,
           used_at = NOW()
       WHERE id = ?`,
      [req.user.id, activationCode.id]
    );

    await connection.commit();

    return success(
      res,
      {
        vip: vipSnapshot,
        activationCode: {
          code: activationCode.code,
          vipLevel: activationCode.vip_level,
          validDays: Number(activationCode.valid_days || 0),
        },
      },
      '兑换成功，会员权益已发放'
    );
  } catch (err) {
    await connection.rollback();
    console.error('兑换VIP激活码失败:', err);
    return error(res, '兑换会员失败，请稍后重试');
  } finally {
    connection.release();
  }
};

module.exports = {
  cancelVipPayment,
  createVipPayment,
  getLatestVipPayment,
  getVipPaymentStatus,
  getVipPlans,
  handleVipPaymentNotify,
  redeemVipActivationCode,
};




