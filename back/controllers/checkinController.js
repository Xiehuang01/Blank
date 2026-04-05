const pool = require('../config/db');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

const POSTCARD_TASK_TYPE = 'send_postcard';
const POSTCARD_TASK_REWARD = 20;
let dailyTaskRewardsTableEnsured = false;

const getTodayString = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const ensureDailyTaskRewardsTable = async () => {
  if (dailyTaskRewardsTableEnsured) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_task_rewards (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      task_type VARCHAR(50) NOT NULL,
      reward_date DATE NOT NULL,
      coins_earned INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_user_task_date (user_id, task_type, reward_date),
      CONSTRAINT fk_daily_task_reward_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日任务奖励表'
  `);

  dailyTaskRewardsTableEnsured = true;
};

const hasSentPostcardToday = async (userId, today) => {
  const [[result]] = await pool.query(
    'SELECT COUNT(*) AS total FROM postcards WHERE user_id = ? AND DATE(created_at) = ?',
    [userId, today]
  );
  return Number(result?.total || 0) > 0;
};

const hasClaimedTaskReward = async (userId, taskType, today) => {
  const [[result]] = await pool.query(
    'SELECT id FROM daily_task_rewards WHERE user_id = ? AND task_type = ? AND reward_date = ? LIMIT 1',
    [userId, taskType, today]
  );
  return !!result;
};

/**
 * 获取签到状态（本月记录）
 * GET /api/checkin/status
 */
const getStatus = async (req, res) => {
  try {
    await ensureDailyTaskRewardsTable();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = getTodayString(now);

    // 获取当月签到
    const [rows] = await pool.query(
      `SELECT checkin_date, coins_earned FROM checkins
       WHERE user_id = ? AND YEAR(checkin_date) = ? AND MONTH(checkin_date) = ?
       ORDER BY checkin_date`,
      [req.user.id, year, month]
    );

    const checkedDays = rows.map(r => {
      const d = new Date(r.checkin_date);
      return d.getDate();
    });

    const isCheckedInToday = rows.some(r => {
      const d = new Date(r.checkin_date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === today;
    });

    // 计算连续签到天数
    let consecutive = 0;
    const sortedDates = rows.map(r => new Date(r.checkin_date)).sort((a, b) => b - a);
    if (sortedDates.length > 0) {
      consecutive = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i - 1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
        if (Math.round(diff) === 1) {
          consecutive++;
        } else {
          break;
        }
      }
    }

    const [sentPostcard, claimedPostcardTaskReward] = await Promise.all([
      hasSentPostcardToday(req.user.id, today),
      hasClaimedTaskReward(req.user.id, POSTCARD_TASK_TYPE, today),
    ]);

    return success(res, {
      checkedDays,
      isCheckedInToday,
      consecutiveDays: consecutive,
      month,
      year,
      postcardTask: {
        hasSentPostcardToday: sentPostcard,
        hasClaimedReward: claimedPostcardTaskReward,
        rewardCoins: POSTCARD_TASK_REWARD,
      },
    });
  } catch (err) {
    console.error('获取签到状态错误:', err);
    return error(res, '获取签到状态失败');
  }
};

/**
 * 执行签到
 * POST /api/checkin
 */
const doCheckin = async (req, res) => {
  try {
    await ensureDailyTaskRewardsTable();

    const now = new Date();
    const today = getTodayString(now);

    // 检查今天是否已签到（用 Redis 快速检查）
    const cacheKey = `checkin:${req.user.id}:${today}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return error(res, '今日已签到', 400);
    }

    // 检查数据库
    const [existing] = await pool.query(
      'SELECT id FROM checkins WHERE user_id = ? AND checkin_date = ?',
      [req.user.id, today]
    );
    if (existing.length > 0) {
      await redis.set(cacheKey, '1', 'EX', 86400);
      return error(res, '今日已签到', 400);
    }

    const coinsEarned = 10;

    // 签到记录
    await pool.query(
      'INSERT INTO checkins (user_id, checkin_date, coins_earned) VALUES (?, ?, ?)',
      [req.user.id, today, coinsEarned]
    );

    // 加邮分
    await pool.query(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [coinsEarned, req.user.id]
    );

    // 缓存到 Redis（今天内不能再签）
    await redis.set(cacheKey, '1', 'EX', 86400);

    // 返回新余额
    const [user] = await pool.query('SELECT coins FROM users WHERE id = ?', [req.user.id]);

    return success(res, {
      coinsEarned,
      totalCoins: user[0].coins,
    }, '签到成功！获得 10 邮分');
  } catch (err) {
    console.error('签到错误:', err);
    return error(res, '签到失败');
  }
};

const claimPostcardTaskReward = async (req, res) => {
  let connection;

  try {
    await ensureDailyTaskRewardsTable();

    const today = getTodayString();
    const sentPostcard = await hasSentPostcardToday(req.user.id, today);
    if (!sentPostcard) {
      return error(res, '请先发送今日明信片再领取奖励', 400);
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [claimedRows] = await connection.query(
      'SELECT id FROM daily_task_rewards WHERE user_id = ? AND task_type = ? AND reward_date = ? LIMIT 1',
      [req.user.id, POSTCARD_TASK_TYPE, today]
    );

    if (claimedRows.length > 0) {
      await connection.rollback();
      return error(res, '今日发送明信片奖励已领取', 400);
    }

    await connection.query(
      'INSERT INTO daily_task_rewards (user_id, task_type, reward_date, coins_earned) VALUES (?, ?, ?, ?)',
      [req.user.id, POSTCARD_TASK_TYPE, today, POSTCARD_TASK_REWARD]
    );

    await connection.query(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [POSTCARD_TASK_REWARD, req.user.id]
    );

    const [[user]] = await connection.query('SELECT coins FROM users WHERE id = ?', [req.user.id]);
    await connection.commit();

    return success(res, {
      coinsEarned: POSTCARD_TASK_REWARD,
      totalCoins: user?.coins || 0,
    }, `领取成功！获得 ${POSTCARD_TASK_REWARD} 邮分`);
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('领取发送明信片任务奖励错误:', err);
    return error(res, '领取奖励失败');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { getStatus, doCheckin, claimPostcardTaskReward };
