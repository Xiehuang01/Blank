const crypto = require('crypto');

const PLAN_META = {
  monthly: {
    vipLevel: 'VIP 1',
    months: 1,
    title: '包月',
  },
  quarterly: {
    vipLevel: 'VIP 1',
    months: 3,
    title: '包季',
  },
  yearly: {
    vipLevel: 'VIP 1',
    months: 12,
    title: '包年',
  },
  lifetime: {
    vipLevel: '终身会员',
    lifetime: true,
    title: '终身会员',
  },
};

const pad = (value) => String(value).padStart(2, '0');

const formatDateTime = (value) => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const parseDateTime = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatAmountFromCents = (value) => (Number(value || 0) / 100).toFixed(2);

// MD5 由易支付(ZPay)平台接口要求，非平台自主选择；若迁移到其他支付平台，请使用 HMAC-SHA256
const md5 = (text) => crypto.createHash('md5').update(String(text)).digest('hex');

const buildZpaySign = (params, key) => {
  const sorted = Object.keys(params || {})
    .filter((field) => field !== 'sign' && field !== 'sign_type')
    .filter((field) => {
      const value = params[field];
      return value !== undefined && value !== null && value !== '';
    })
    .sort();


  const query = sorted.map((field) => `${field}=${params[field]}`).join('&');
  return md5(`${query}${key}`);
};

const normalizeVipSnapshot = (user) => ({
  vipLevel: user?.vip_level || 'VIP 0',
  vipPlanKey: user?.vip_plan_key || null,
  vipExpiresAt: formatDateTime(user?.vip_expires_at),
  isLifetime: user?.vip_plan_key === 'lifetime',
});

const hasVipAccess = (vipSnapshot) => {
  if (!vipSnapshot) return false;
  return String(vipSnapshot.vipLevel || 'VIP 0') !== 'VIP 0';
};


const isVipExpired = (user) => {
  if (!user?.vip_plan_key || user.vip_plan_key === 'lifetime' || !user.vip_expires_at) {
    return false;
  }

  const expireAt = parseDateTime(user.vip_expires_at);
  return !expireAt || expireAt.getTime() <= Date.now();
};

const syncUserVipStatus = async (executor, userId, options = {}) => {
  const { forUpdate = false } = options;
  const suffix = forUpdate ? ' FOR UPDATE' : '';
  const [rows] = await executor.query(
    `SELECT id, vip_level, vip_plan_key, vip_expires_at
     FROM users
     WHERE id = ?${suffix}`,
    [userId]
  );

  if (!rows.length) return null;

  const user = rows[0];
  if (!isVipExpired(user)) {
    return normalizeVipSnapshot(user);
  }

  await executor.query(
    `UPDATE users
     SET vip_level = 'VIP 0', vip_plan_key = NULL, vip_expires_at = NULL, updated_at = NOW()
     WHERE id = ?`,
    [userId]
  );

  return {
    vipLevel: 'VIP 0',
    vipPlanKey: null,
    vipExpiresAt: null,
    isLifetime: false,
  };
};

const addMonthsSafe = (baseDate, months) => {
  const result = new Date(baseDate.getTime());
  const originalDate = result.getDate();
  result.setMonth(result.getMonth() + months);
  if (result.getDate() !== originalDate) {
    result.setDate(0);
  }
  return result;
};

const addDaysSafe = (baseDate, days) => {
  const result = new Date(baseDate.getTime());
  result.setDate(result.getDate() + days);
  return result;
};

const grantVipPlan = async (executor, userId, planKey) => {

  const meta = PLAN_META[planKey];
  if (!meta) {
    throw new Error(`未知的VIP计划：${planKey}`);
  }

  const currentVip = await syncUserVipStatus(executor, userId, { forUpdate: true });
  if (!currentVip) {
    throw new Error('用户不存在');
  }

  if (currentVip.vipPlanKey === 'lifetime') {
    return currentVip;
  }

  if (meta.lifetime) {
    await executor.query(
      `UPDATE users
       SET vip_level = ?, vip_plan_key = ?, vip_expires_at = NULL, updated_at = NOW()
       WHERE id = ?`,
      [meta.vipLevel, planKey, userId]
    );

    return {
      vipLevel: meta.vipLevel,
      vipPlanKey: planKey,
      vipExpiresAt: null,
      isLifetime: true,
    };
  }

  const now = new Date();
  const currentExpireAt = parseDateTime(currentVip.vipExpiresAt);
  const startAt = currentExpireAt && currentExpireAt.getTime() > now.getTime() ? currentExpireAt : now;
  const nextExpireAt = addMonthsSafe(startAt, meta.months);

  await executor.query(
    `UPDATE users
     SET vip_level = ?, vip_plan_key = ?, vip_expires_at = ?, updated_at = NOW()
     WHERE id = ?`,
    [meta.vipLevel, planKey, formatDateTime(nextExpireAt), userId]
  );

  return {
    vipLevel: meta.vipLevel,
    vipPlanKey: planKey,
    vipExpiresAt: formatDateTime(nextExpireAt),
    isLifetime: false,
  };
};

const grantVipByActivationCode = async (executor, userId, activationCode) => {
  const vipLevel = String(activationCode?.vip_level || activationCode?.vipLevel || 'VIP 1').trim() || 'VIP 1';
  const validDays = Math.max(1, Number(activationCode?.valid_days || activationCode?.validDays || 0));
  const currentVip = await syncUserVipStatus(executor, userId, { forUpdate: true });

  if (!currentVip) {
    throw new Error('用户不存在');
  }

  if (currentVip.vipPlanKey === 'lifetime') {
    return currentVip;
  }

  const now = new Date();
  const currentExpireAt = parseDateTime(currentVip.vipExpiresAt);
  const startAt = currentExpireAt && currentExpireAt.getTime() > now.getTime() ? currentExpireAt : now;
  const nextExpireAt = addDaysSafe(startAt, validDays);
  const nextPlanKey = currentVip.vipPlanKey && currentVip.vipPlanKey !== 'lifetime' ? currentVip.vipPlanKey : 'activation';

  await executor.query(
    `UPDATE users
     SET vip_level = ?, vip_plan_key = ?, vip_expires_at = ?, updated_at = NOW()
     WHERE id = ?`,
    [vipLevel, nextPlanKey, formatDateTime(nextExpireAt), userId]
  );

  return {
    vipLevel,
    vipPlanKey: nextPlanKey,
    vipExpiresAt: formatDateTime(nextExpireAt),
    isLifetime: false,
  };
};

module.exports = {
  PLAN_META,
  buildZpaySign,
  formatAmountFromCents,
  formatDateTime,
  grantVipByActivationCode,
  grantVipPlan,
  md5,
  normalizeVipSnapshot,
  hasVipAccess,
  parseDateTime,
  syncUserVipStatus,
};


