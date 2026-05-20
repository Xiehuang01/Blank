const pool = require('../config/db');

let schemaEnsured = false;

const ensureUsersIdentityColumn = async () => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME = 'identity'`
  );

  if (Number(rows?.[0]?.total || 0) === 0) {
    await pool.query(
      `ALTER TABLE users
       ADD COLUMN identity ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '用户身份' AFTER email`
    );
  }
};

const ensureUsersVipColumns = async () => {
  const ensureColumn = async (columnName, definition) => {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = ?`,
      [columnName]
    );

    if (Number(rows?.[0]?.total || 0) === 0) {
      await pool.query(`ALTER TABLE users ADD COLUMN ${definition}`);
    }
  };

  await ensureColumn('avatar', `avatar VARCHAR(500) DEFAULT '' COMMENT '头像URL' AFTER password_hash`);
  await ensureColumn('vip_level', `vip_level VARCHAR(20) DEFAULT 'VIP 0' COMMENT 'VIP等级' AFTER avatar`);
  await ensureColumn('coins', `coins INT UNSIGNED DEFAULT 100 COMMENT '邮分（虚拟货币）' AFTER vip_level`);
  await ensureColumn('vip_plan_key', `vip_plan_key VARCHAR(32) DEFAULT NULL COMMENT 'VIP订阅计划标识' AFTER vip_level`);
  await ensureColumn('vip_expires_at', `vip_expires_at DATETIME DEFAULT NULL COMMENT 'VIP到期时间' AFTER vip_plan_key`);
  await ensureColumn('gender', `gender ENUM('男', '女', '保密') DEFAULT '保密' COMMENT '性别' AFTER coins`);
  await ensureColumn('birthday', `birthday DATE DEFAULT NULL COMMENT '生日' AFTER gender`);
  await ensureColumn('location', `location VARCHAR(100) DEFAULT '' COMMENT '所在地' AFTER birthday`);
  await ensureColumn('profile_visibility', `profile_visibility ENUM('所有人', '仅好友', '仅自己') DEFAULT '所有人' COMMENT '个人资料可见性' AFTER location`);
};

const ensureStampSeriesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stamp_series (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(255) DEFAULT '' COMMENT '系列描述',
      sort_order INT NOT NULL DEFAULT 0 COMMENT '排序值',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_stamp_series_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮票系列表'
  `);

  // Migrate: add folder_name column if not exists
  const [folderCol] = await pool.query(
    `SELECT COUNT(*) AS total FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stamp_series' AND COLUMN_NAME = 'folder_name'`
  );
  if (Number(folderCol?.[0]?.total || 0) === 0) {
    await pool.query(
      `ALTER TABLE stamp_series ADD COLUMN folder_name VARCHAR(100) DEFAULT NULL COMMENT '对应 res/stamps/systemstamps/ 下的文件夹名' AFTER name`
    );
  }

  await pool.query(`
    INSERT IGNORE INTO stamp_series (name, description, sort_order)
    SELECT DISTINCT series_id, '', 0
    FROM stamps
    WHERE series_id IS NOT NULL AND TRIM(series_id) != ''
  `);
};

const ensureVipActivationCodesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vip_activation_codes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      code VARCHAR(32) NOT NULL,
      vip_level VARCHAR(20) NOT NULL DEFAULT 'VIP 1' COMMENT '目标会员等级',
      valid_days INT UNSIGNED NOT NULL DEFAULT 30 COMMENT '生效天数',
      status ENUM('unused', 'used', 'disabled') NOT NULL DEFAULT 'unused' COMMENT '激活码状态',
      note VARCHAR(255) DEFAULT '' COMMENT '备注',
      used_by INT UNSIGNED DEFAULT NULL COMMENT '使用者ID',
      used_at TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
      created_by INT UNSIGNED DEFAULT NULL COMMENT '创建人ID',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_vip_activation_code (code),
      KEY idx_vip_activation_status (status),
      CONSTRAINT fk_vip_activation_used_by FOREIGN KEY (used_by) REFERENCES users (id) ON DELETE SET NULL,
      CONSTRAINT fk_vip_activation_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员激活码表'
  `);
};

const ensureVipPlansTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vip_plans (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      plan_key VARCHAR(32) NOT NULL COMMENT '计划标识：monthly/quarterly/yearly/lifetime',
      title VARCHAR(50) NOT NULL COMMENT '展示标题',
      billing_unit ENUM('month','quarter','year','lifetime') NOT NULL COMMENT '计费单位',
      price_cents INT UNSIGNED NOT NULL COMMENT '价格（分）',
      currency CHAR(3) NOT NULL DEFAULT 'CNY' COMMENT '币种',
      is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否上架',
      sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_vip_plan_key (plan_key),
      KEY idx_vip_plan_active_sort (is_active, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP订阅计划表'
  `);

  await pool.query(`
    INSERT INTO vip_plans (plan_key, title, billing_unit, price_cents, currency, is_active, sort_order) VALUES
    ('monthly', '包月', 'month', 688, 'CNY', 1, 10),
    ('quarterly', '包季', 'quarter', 1888, 'CNY', 1, 20),
    ('yearly', '包年', 'year', 6888, 'CNY', 1, 30),
    ('lifetime', '终身会员', 'lifetime', 8888, 'CNY', 1, 40)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      billing_unit = VALUES(billing_unit),
      price_cents = VALUES(price_cents),
      currency = VALUES(currency),
      is_active = VALUES(is_active),
      sort_order = VALUES(sort_order)
  `);
};

const ensureVipOrdersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vip_orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_no VARCHAR(32) NOT NULL COMMENT '商户订单号',
      user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
      plan_key VARCHAR(32) NOT NULL COMMENT 'VIP方案标识',
      plan_title VARCHAR(50) NOT NULL COMMENT 'VIP方案名称',
      amount_cents INT UNSIGNED NOT NULL COMMENT '订单金额（分）',
      payment_type VARCHAR(20) NOT NULL DEFAULT 'alipay' COMMENT '支付方式',
      status ENUM('created','pending','paid','failed','refunded','closed') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
      zpay_trade_no VARCHAR(64) DEFAULT NULL COMMENT '易支付订单号',
      pay_url VARCHAR(500) DEFAULT '' COMMENT '支付链接',
      request_ip VARCHAR(64) DEFAULT '' COMMENT '下单IP',
      device VARCHAR(20) DEFAULT 'pc' COMMENT '设备类型',
      notify_raw TEXT DEFAULT NULL COMMENT '原始回调内容',
      paid_at DATETIME DEFAULT NULL COMMENT '支付完成时间',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_vip_order_no (order_no),
      KEY idx_vip_orders_user (user_id, created_at),
      KEY idx_vip_orders_status (status, created_at),
      CONSTRAINT fk_vip_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP支付订单表'
  `);
};


const ensurePostcardCreatedAtDatetime = async () => {
  const [createdAtCol] = await pool.query(
    `SELECT DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'postcards' AND COLUMN_NAME = 'created_at'`
  );

  const createdAtType = String(createdAtCol?.[0]?.DATA_TYPE || '').toLowerCase();
  if (createdAtType && createdAtType !== 'datetime') {
    await pool.query(
      `ALTER TABLE postcards
       MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间'`
    );
  }
};

// Expand postcards.status enum to include review states and schedule fields
const ensurePostcardReviewStates = async () => {

  const [cols] = await pool.query(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'postcards' AND COLUMN_NAME = 'status'`
  );
  const colType = cols?.[0]?.COLUMN_TYPE || '';
  if (!colType.includes('reviewing') || !colType.includes('scheduled')) {
    await pool.query(
      `ALTER TABLE postcards MODIFY COLUMN status ENUM('draft','scheduled','sent','reviewing','pending','rejected') DEFAULT 'sent' COMMENT '状态：draft/scheduled(定时发送)/sent/reviewing(AI审核中)/pending(待人工审核)/rejected(已驳回)'`
    );
  }
  // Add review_reason column
  const [reasonCol] = await pool.query(
    `SELECT COUNT(*) AS total FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'postcards' AND COLUMN_NAME = 'review_reason'`
  );
  if (Number(reasonCol?.[0]?.total || 0) === 0) {
    await pool.query(
      `ALTER TABLE postcards ADD COLUMN review_reason VARCHAR(500) DEFAULT NULL COMMENT 'AI/人工审核原因' AFTER status`
    );
  }

  const [scheduledAtCol] = await pool.query(
    `SELECT COUNT(*) AS total FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'postcards' AND COLUMN_NAME = 'scheduled_at'`
  );
  if (Number(scheduledAtCol?.[0]?.total || 0) === 0) {
    await pool.query(
      `ALTER TABLE postcards ADD COLUMN scheduled_at DATETIME DEFAULT NULL COMMENT '定时发送时间' AFTER review_reason`
    );
  }
};

// Notifications table
const ensureNotificationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL COMMENT '接收通知的用户',
      type VARCHAR(50) NOT NULL DEFAULT 'review' COMMENT '通知类型',
      title VARCHAR(200) NOT NULL DEFAULT '' COMMENT '通知标题',
      content TEXT COMMENT '通知内容',
      postcard_id INT UNSIGNED DEFAULT NULL COMMENT '关联明信片ID',
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_notification_user (user_id, is_read),
      KEY idx_notification_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户通知表'
  `);
};

const ensureAppSchema = async () => {
  if (schemaEnsured) return;

  await ensureUsersIdentityColumn();
  await ensureUsersVipColumns();
  await ensureStampSeriesTable();
  await ensureVipActivationCodesTable();
  await ensureVipPlansTable();
  await ensureVipOrdersTable();
  await ensurePostcardCreatedAtDatetime();
  await ensurePostcardReviewStates();
  await ensureNotificationsTable();


  schemaEnsured = true;
};

module.exports = {
  ensureAppSchema,
};
