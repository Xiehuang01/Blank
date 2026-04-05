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

// Expand postcards.status enum to include review states
const ensurePostcardReviewStates = async () => {
  const [cols] = await pool.query(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'postcards' AND COLUMN_NAME = 'status'`
  );
  const colType = cols?.[0]?.COLUMN_TYPE || '';
  if (!colType.includes('reviewing')) {
    await pool.query(
      `ALTER TABLE postcards MODIFY COLUMN status ENUM('draft','sent','reviewing','pending','rejected') DEFAULT 'sent' COMMENT '状态：draft/sent/reviewing(AI审核中)/pending(待人工审核)/rejected(已驳回)'`
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
  await ensureStampSeriesTable();
  await ensureVipActivationCodesTable();
  await ensurePostcardReviewStates();
  await ensureNotificationsTable();

  schemaEnsured = true;
};

module.exports = {
  ensureAppSchema,
};
