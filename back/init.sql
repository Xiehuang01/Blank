-- ============================================================
-- Blank 明信片应用 - 数据库初始化脚本
-- 数据库: blank (MySQL 8)
-- 字符集: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `blank` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `blank`;

-- ============================================================
-- 用户表
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` VARCHAR(10) NOT NULL COMMENT '7位随机唯一用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `avatar` VARCHAR(500) DEFAULT '' COMMENT '头像URL',
  `vip_level` VARCHAR(20) DEFAULT 'VIP 0' COMMENT 'VIP等级',
  `coins` INT UNSIGNED DEFAULT 100 COMMENT '邮分（虚拟货币）',
  `gender` ENUM('男', '女', '保密') DEFAULT '保密' COMMENT '性别',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `location` VARCHAR(100) DEFAULT '' COMMENT '所在地',
  `profile_visibility` ENUM('所有人', '仅好友', '仅自己') DEFAULT '所有人' COMMENT '个人资料可见性',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_uid` (`uid`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================================
-- 邮票表
-- ============================================================
CREATE TABLE IF NOT EXISTS `stamps` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `series_id` VARCHAR(50) NOT NULL COMMENT '系列分类ID',
  `title` VARCHAR(100) NOT NULL COMMENT '邮票标题',
  `description` TEXT COMMENT '邮票描述',
  `price` INT UNSIGNED DEFAULT 5 COMMENT '价格（邮分）',
  `image_path` VARCHAR(500) NOT NULL COMMENT '图片路径',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_series` (`series_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮票表';

-- ============================================================
-- 用户邮票表
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_stamps` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `stamp_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '当前持有数量',
  `purchased_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_stamp` (`user_id`, `stamp_id`),
  CONSTRAINT `fk_us_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_us_stamp` FOREIGN KEY (`stamp_id`) REFERENCES `stamps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户邮票表';

-- ============================================================
-- 明信片表
-- ============================================================
CREATE TABLE IF NOT EXISTS `postcards` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '创建者ID',
  `title` VARCHAR(200) DEFAULT '' COMMENT '明信片标题',
  `image_url` VARCHAR(1000) NOT NULL COMMENT '正面图片URL',
  `image_offset_x` FLOAT DEFAULT 0 COMMENT '图片X偏移',
  `image_offset_y` FLOAT DEFAULT 0 COMMENT '图片Y偏移',
  `image_scale` FLOAT DEFAULT 1 COMMENT '图片缩放',
  `image_rotation` FLOAT DEFAULT 0 COMMENT '图片旋转角度',
  `aspect_ratio` VARCHAR(10) DEFAULT '3/2' COMMENT '纵横比（3/2 或 2/3）',
  `canvas_width` INT DEFAULT 600 COMMENT '画布宽度',
  `canvas_height` INT DEFAULT 400 COMMENT '画布高度',
  `stamp_id` INT UNSIGNED DEFAULT NULL COMMENT '所用邮票ID',
  `recipient_input` VARCHAR(100) DEFAULT '' COMMENT '收件人（UID或用户名）',
  `is_public` TINYINT(1) DEFAULT 0 COMMENT '是否公开到广场',
  `postcard_type` ENUM('normal', 'drifting') DEFAULT 'normal' COMMENT '明信片类型',
  `elements` JSON COMMENT '交互式元素（文字/贴纸）JSON',
  `status` ENUM('draft', 'sent') DEFAULT 'sent' COMMENT '状态',
  `sender_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '发件人是否删除',
  `recipient_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '收件人是否删除',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`postcard_type`),
  KEY `idx_public` (`is_public`),
  KEY `idx_recipient` (`recipient_input`),
  CONSTRAINT `fk_pc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_stamp` FOREIGN KEY (`stamp_id`) REFERENCES `stamps` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='明信片表';

-- ============================================================
-- 点赞表
-- ============================================================
CREATE TABLE IF NOT EXISTS `likes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `postcard_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_postcard` (`user_id`, `postcard_id`),
  KEY `idx_postcard` (`postcard_id`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_like_postcard` FOREIGN KEY (`postcard_id`) REFERENCES `postcards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- ============================================================
-- 评论表
-- ============================================================
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `postcard_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL COMMENT '评论内容',
  `is_pinned` TINYINT(1) DEFAULT 0 COMMENT '是否置顶',
  `likes_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_postcard` (`postcard_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `fk_comment_postcard` FOREIGN KEY (`postcard_id`) REFERENCES `postcards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ============================================================
-- 评论点赞表
-- ============================================================
CREATE TABLE IF NOT EXISTS `comment_likes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `comment_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_comment` (`user_id`, `comment_id`),
  CONSTRAINT `fk_cl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cl_comment` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论点赞表';

-- ============================================================
-- 好友表
-- ============================================================
CREATE TABLE IF NOT EXISTS `friends` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '发起方',
  `friend_id` INT UNSIGNED NOT NULL COMMENT '接收方',
  `status` ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending' COMMENT '状态',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_friendship` (`user_id`, `friend_id`),
  KEY `idx_friend` (`friend_id`),
  CONSTRAINT `fk_friend_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_friend_target` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='好友表';

-- ============================================================
-- 签到表
-- ============================================================
CREATE TABLE IF NOT EXISTS `checkins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `checkin_date` DATE NOT NULL COMMENT '签到日期',
  `coins_earned` INT UNSIGNED DEFAULT 10 COMMENT '获得邮分',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `checkin_date`),
  CONSTRAINT `fk_checkin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='签到表';

-- ============================================================
-- 初始数据 - 系统邮票（与前端 stamps.ts 对应）
-- ============================================================
INSERT INTO `stamps` (`id`, `series_id`, `title`, `description`, `price`, `image_path`) VALUES
-- 四季系列
(1, '四季', '雨天邮票', '描绘暴雨将至的原野，乌云压城，雨丝细密，营造出一种深沉、静谧且略带压抑的雨天氛围。', 5, '/res/stamps/systemstamps/weather/雨天.png'),
(2, '四季', '冬季邮票', '寒梅傲雪的冬日插画，冰清玉洁的红梅在蓝天背景下傲然绽放，寓意寒冬中的坚韧与希望。', 5, '/res/stamps/systemstamps/fourseason/冬.png'),
(3, '四季', '秋天邮票', '金秋向日葵画卷，明黄底色映衬着饱满的花盘，文字鎏金，充满了秋日的丰收与温暖质感。', 5, '/res/stamps/systemstamps/fourseason/秋.png'),
(4, '四季', '春天邮票', '春日繁花初绽插画，洁白的花朵搭配嫩绿枝芽，清新的黄色背景，唤醒万物复苏的生机。', 5, '/res/stamps/systemstamps/fourseason/春.png'),
-- 猫狗系列
(5, '猫狗', '狗狗邮票', '幻彩霓虹风的萌犬肖像，冷暖色调交织碰撞，呈现出梦幻又温暖的光影效果，极具艺术感。', 5, '/res/stamps/systemstamps/dogandcat/狗狗.png'),
-- 心情系列
(6, '心情', '开心邮票', '定格花海中雀跃的瞬间，明媚的笑容与金黄阳光融为一体，传递着纯粹的喜悦与青春活力。', 5, '/res/stamps/systemstamps/emotion/开心.png'),
(7, '猫狗', '咪咪邮票', '梦幻渐变风的猫咪特写，橙蓝撞色光影，慵懒又灵动，尽显猫咪的神秘与治愈气质。', 5, '/res/stamps/systemstamps/dogandcat/咪咪.png'),
-- 天气系列
(8, '天气', '晴天邮票', '治愈系黄昏风景画，暖阳高挂，云层层叠浸染，绿意盎然的大地沐浴在金色余晖中。', 5, '/res/stamps/systemstamps/weather/晴天.png'),
(9, '心情', '伤心邮票', '落寞身影融入花海，色调清冷忧郁，描绘了沉浸在悲伤情绪中、独自沉思的孤独时刻。', 5, '/res/stamps/systemstamps/emotion/伤心.png'),
(10, '四季', '夏天邮票', '夏日清荷插画，粉嫩的荷花与翠绿荷叶相映成趣，清新雅致，寓意盛夏的清新与静谧。', 5, '/res/stamps/systemstamps/fourseason/夏.png');
