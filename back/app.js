require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { errorHandler } = require('./middleware/errorHandler');

// 路由导入
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postcardRoutes = require('./routes/postcard');
const stampRoutes = require('./routes/stamp');
const friendRoutes = require('./routes/friend');
const checkinRoutes = require('./routes/checkin');
const commentRoutes = require('./routes/comment');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ============ 中间件 ============

// CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body 解析
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态资源
// 上传文件目录
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir, {
  maxAge: '30d',
  immutable: true,
}));

// res 目录（邮票、贴纸、字体等静态资源）
app.use('/res', express.static(path.join(__dirname, 'res')));

// ============ 路由注册 ============
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/postcards', postcardRoutes);
app.use('/api/stamps', stampRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ 错误处理 ============
app.use(errorHandler);

// ============ 启动服务 ============
app.listen(PORT, () => {
  console.log(`\n🚀 Blank Backend Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📂 Static res: http://localhost:${PORT}/res`);
  console.log(`📂 Uploads: http://localhost:${PORT}/uploads\n`);
});

module.exports = app;
