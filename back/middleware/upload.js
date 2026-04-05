const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 头像上传配置
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', 'avatars'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${uuidv4()}${ext}`);
  },
});

// 明信片图片上传配置
const postcardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', 'postcards'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `postcard_${uuidv4()}${ext}`);
  },
});

// 邮票图片上传配置
const stampStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads', 'stamps'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `stamp_${uuidv4()}${ext}`);
  },
});

// 文件过滤器（只允许图片）
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件 (jpeg/png/gif/webp)'), false);
  }
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: maxSize },
});

const uploadPostcard = multer({
  storage: postcardStorage,
  fileFilter: imageFilter,
  limits: { fileSize: maxSize },
});

const uploadStamp = multer({
  storage: stampStorage,
  fileFilter: imageFilter,
  limits: { fileSize: maxSize },
});

// 确保上传目录存在
const fs = require('fs');
const ensureUploadDirs = () => {
  const baseDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
  const dirs = [
    path.join(baseDir, 'avatars'),
    path.join(baseDir, 'postcards'),
    path.join(baseDir, 'stamps'),
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
ensureUploadDirs();

module.exports = { uploadAvatar, uploadPostcard, uploadStamp };
