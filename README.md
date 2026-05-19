# 留白 Blank

> 一张明信片，一份心意。留白是一款明信片创作与社交应用——你可以用图片、邮票、文字和贴纸制作独一无二的明信片，寄给特定好友，或投入「漂流瓶」让陌生人邂逅你的故事。

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-brightgreen?logo=vuedotjs" alt="Vue 3.5" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=nodedotjs" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql" alt="MySQL 8.0" />
  <img src="https://img.shields.io/badge/Redis-7-red?logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
</p>

---

## 为什么需要留白

即时通讯让表达变得廉价——一句话发出去，下一秒就被下一句淹没。留白把节奏慢下来：选一张照片，挑一枚邮票，写一段文字，贴几个贴纸，然后寄出去。收件人看到的不是一条通知，而是一张完整的明信片。

- **寄给朋友** —— 用 UID 或用户名找到对方，你的明信片直达对方的收件箱
- **扔进大海** —— 公开漂流模式，让陌生人收到你的心意，你不知道谁会收到，对方也不知道寄件人是谁
- **慢递定时发送** —— 设定未来的某个时间，明信片会在那一刻准时送达

---

## 功能一览

### 明信片创作
- 上传照片作为明信片正面，支持缩放、旋转、拖拽定位
- 丰富的文字样式（多种手写体中文字体）和贴纸库（动物、涂鸦、箭头、表情等）
- 选择邮票——系统邮票用邮分购买，省份邮票在商城兑换
- 支持横版（3:2）和竖版（2:3）两种画幅

### 社交互动
- **发现广场**：浏览所有公开分享的明信片
- **漂流瓶**：随机收到来自陌生人的明信片，也可以把自己的投入大海
- **点赞与收藏**：喜欢就点个赞，收藏到个人收藏夹
- **评论系统**：评论支持置顶和点赞
- **好友系统**：通过 UID 或用户名搜索并添加好友

### 用户成长
- **每日签到**：每天签到获取邮分，连续签到奖励更多
- **VIP 会员**：包月/包季/包年/终身四种方案，VIP 用户发送明信片不消耗邮票
- **个人主页**：展示自己的明信片、收藏和邮票收藏

### 安全与质量
- **AI 内容审核**：所有明信片图片和文字通过通义千问模型自动审核
- **软删除机制**：删除明信片后进入回收状态，双方都删除才物理清除
- **JWT 认证**：支持 token 黑名单（登出即失效）
- **暗色模式**：自动跟随系统主题

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | Vue 3 + Vite + TypeScript | SPA 框架，组合式 API |
| **UI** | TailwindCSS v4 + Element Plus | 原子化 CSS + 企业级组件库 |
| **路由** | Vue Router 5 | 路由守卫 + KeepAlive 页面缓存 |
| **后端** | Node.js + Express | RESTful API 服务 |
| **数据库** | MySQL 8.0 + mysql2 | 关系型存储，utf8mb4 字符集 |
| **缓存** | Redis + ioredis | JWT 黑名单、会话、缓存热点数据 |
| **认证** | JWT + bcryptjs | 无状态认证，密码哈希存储 |
| **上传** | Multer | 头像/明信片/邮票分类存储 |
| **邮件** | Nodemailer + SMTP | 邮箱验证码发送 |
| **AI 审核** | DashScope (通义千问) | qwen3.5-flash 审核图片，qwen-turbo 审核文字 |
| **支付** | 易支付 (ZPay) | 支付宝渠道，VIP 订阅支付 |
| **包管理** | pnpm | monorepo 风格双包管理 |

---

## 快速开始

### 前置要求

- **Node.js** >= 18
- **pnpm** >= 8（推荐通过 `npm install -g pnpm` 安装）
- **MySQL** >= 8.0
- **Redis** >= 6.0
- **SMTP 邮箱账号**（用于发送验证码）

### 1. 克隆项目

```bash
git clone https://github.com/xiehuang01/blank.git
cd blank
```

### 2. 安装依赖

```bash
# 后端依赖
cd back && pnpm install

# 前端依赖
cd ../front && pnpm install
```

### 3. 配置环境变量

在 `back/` 目录下创建 `.env` 文件（参考下方 [环境变量说明](#环境变量说明)）：

```bash
cd back
cp .env .env.example   # 备份模板（.env 中变量值为空，format 即为模板）
# 编辑 .env 填入你的实际配置
```

最少需要填写的关键变量：

```bash
# 数据库
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blank

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# 邮箱（用于发送验证码）
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=EchoDiary <your_email@example.com>

# AI 审核（DashScope）
DASHSCOPE_API_KEY=sk-your-dashscope-key
```

### 4. 初始化数据库

启动 MySQL 后，执行初始化脚本：

```bash
mysql -u root -p < back/init.sql
```

该脚本会：
- 创建 `blank` 数据库（utf8mb4 字符集）
- 建立所有业务表（用户、明信片、邮票、评论、好友、签到、VIP 订单等）
- 插入默认邮票系列和系统邮票数据
- 插入默认 VIP 订阅计划

> 应用启动时，`back/utils/schema.js` 中的 `ensureAppSchema()` 会自动补全缺失的列和表，所以你不需要手动管理数据库迁移。

### 5. 启动开发服务器

```bash
# 终端 1：启动后端（端口 3001，nodemon 热重载）
cd back && pnpm dev

# 终端 2：启动前端（端口 3000，Vite HMR）
cd front && pnpm dev
```

打开浏览器访问 **http://localhost:3000**。

验证后端正常运行：

```bash
curl http://localhost:3001/api/health
# 返回：{"status":"ok","timestamp":"2026-05-18T..."}
```

### 6. 生产构建

```bash
# 构建前端
cd front && pnpm build    # 输出到 front/dist/

# 启动后端（生产模式）
cd back && NODE_ENV=production pnpm start
```

生产环境下，建议使用 Nginx 反向代理将前端静态文件和后端 API 统一到一个域名下。前端 API baseURL 在生产环境为 `/api`（同域代理）。

---

## 项目结构

```
blank/
├── back/                          # 后端服务
│   ├── app.js                     # Express 入口：CORS、路由注册、静态文件、健康检查
│   ├── config/                    # 数据库连接池、Redis 连接、邮件发送器
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── mail.js
│   ├── controllers/               # 业务逻辑层（每个模块一个文件）
│   │   ├── authController.js      # 注册/登录/登出/密码重置/邮箱验证
│   │   ├── userController.js      # 用户信息/头像上传
│   │   ├── postcardController.js  # 明信片 CRUD/广场/漂流/定时发送
│   │   ├── stampController.js     # 邮票系列/购买/用户邮票
│   │   ├── friendController.js    # 好友申请/接受/拒绝/列表
│   │   ├── checkinController.js   # 每日签到
│   │   ├── commentController.js   # 评论/置顶/点赞
│   │   ├── vipController.js       # VIP 订阅/支付回调/激活码
│   │   └── adminController.js     # 管理员审核/用户管理
│   ├── routes/                    # 路由层（薄层，只做路由映射和中间件绑定）
│   ├── middleware/                 # Express 中间件
│   │   ├── auth.js                # JWT 认证 + token 黑名单 + 可选认证 + admin 权限
│   │   ├── upload.js              # Multer 文件上传（头像/明信片/邮票）
│   │   └── errorHandler.js        # 全局错误处理
│   ├── services/                  # 业务服务层
│   │   ├── moderation.js          # AI 内容审核（DashScope 通义千问）
│   │   └── vipService.js          # VIP 状态管理 + 易支付签名
│   ├── utils/                     # 工具函数
│   │   ├── response.js            # 统一响应格式 {code, message, data}
│   │   ├── jwt.js                 # JWT 签发/验证
│   │   ├── schema.js              # DDL 自动迁移
│   │   └── helpers.js             # 通用辅助函数
│   ├── res/                       # 静态资源
│   │   ├── font/                  # 中文字体文件（.ttf/.otf）
│   │   ├── stamps/                # 邮票图片（province/ 省份邮票, systemstamps/ 系统邮票）
│   │   ├── sticker/               # 贴纸图片（动物/箭头/表情/涂鸦/狗剪影）
│   │   └── postmark/              # 邮戳图片
│   ├── init.sql                   # 数据库初始化脚本
│   ├── .env                       # 环境变量（不纳入版本控制）
│   └── package.json
│
├── front/                         # 前端应用
│   └── src/
│       ├── main.ts                # Vue 初始化、Element Plus、暗色模式检测、路由挂载
│       ├── App.vue                # 根组件：router-view + BottomNav + 全局 Loading
│       ├── api/                   # API 封装层（每个后端模块一个文件）
│       │   ├── auth.js            # 认证相关 API
│       │   ├── user.js            # 用户相关 API
│       │   ├── postcard.js        # 明信片相关 API
│       │   ├── stamp.js           # 邮票相关 API
│       │   ├── friend.js          # 好友相关 API
│       │   ├── checkin.js         # 签到相关 API
│       │   ├── comment.js         # 评论相关 API
│       │   ├── vip.js             # VIP 支付相关 API
│       │   ├── notification.js    # 通知相关 API
│       │   ├── ai.js              # AI 生成相关 API
│       │   └── admin.js           # 管理后台 API
│       ├── pages/                 # 页面组件（按路由命名）
│       │   ├── Home.vue           # 首页·发现广场
│       │   ├── Mail.vue           # 收件箱
│       │   ├── Shop.vue           # 邮票商城
│       │   ├── Create.vue         # 明信片创作
│       │   ├── PostDetail.vue     # 明信片详情
│       │   ├── Profile.vue        # 个人主页
│       │   ├── Outbox.vue         # 发件箱
│       │   ├── MyStamps.vue       # 我的邮票
│       │   ├── Favorites.vue      # 收藏夹
│       │   ├── CheckIn.vue        # 每日签到
│       │   ├── Vip.vue            # VIP 会员中心
│       │   ├── Login.vue          # 登录
│       │   ├── Register.vue       # 注册
│       │   ├── ForgotPassword.vue # 忘记密码
│       │   ├── Settings.vue       # 设置
│       │   ├── PersonalInfo.vue   # 个人信息编辑
│       │   ├── AccountManagement.vue  # 账号管理
│       │   └── manager/           # 管理后台
│       ├── components/            # 公共组件
│       │   ├── BottomNav.vue      # 底部导航栏
│       │   └── Loading.vue        # 全局加载指示器
│       ├── router/                # 路由配置
│       │   ├── routes.ts          # 路由定义
│       │   └── index.ts           # 导航守卫（认证检查、角色校验、登录跳转）
│       ├── store/                 # 全局状态
│       │   ├── user.ts            # 用户状态（登录态/信息）
│       │   ├── checkin.ts         # 签到状态
│       │   └── mailAlert.ts       # 新邮件提醒
│       └── utils/
│           └── request.js         # Axios 实例：baseURL、token 注入、401 处理、全局请求计数
│
├── CLAUDE.md                      # AI 辅助开发指引文档
└── README.md                      # 本文件
```

---

## API 路由一览

| 前缀 | 模块 | 主要端点 |
|------|------|---------|
| `/api/auth` | 认证 | 注册、登录、登出、忘记密码、邮箱验证码 |
| `/api/user` | 用户 | 个人信息、头像上传、uid/邮箱/用户名搜索 |
| `/api/postcards` | 明信片 | CRUD、发现广场、漂流、点赞、收藏、收件箱、发件箱 |
| `/api/stamps` | 邮票 | 系列列表、详情、用户邮票、购买 |
| `/api/friends` | 好友 | 申请、接受、拒绝、列表 |
| `/api/checkin` | 签到 | 每日签到（获得邮分） |
| `/api/comments` | 评论 | CRUD、置顶、点赞 |
| `/api/ai` | AI | AI 生成内容 |
| `/api/admin` | 管理 | 审核明信片、管理用户、激活码 |
| `/api/notifications` | 通知 | 用户通知 |
| `/api/vip` | 会员 | VIP 计划、创建订单、支付回调、激活码兑换 |

所有 API 响应统一格式：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

`code: 0` 表示成功，其余状态码表示各类错误。

---

## 环境变量说明

所有环境变量在 `back/.env` 中配置。以下为完整参考：

| 变量 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `PORT` | number | 否 | `3001` | 后端服务端口 |
| `NODE_ENV` | string | 否 | `development` | 运行环境（development / production） |
| **数据库** | | | | |
| `DB_HOST` | string | **是** | — | MySQL 主机地址 |
| `DB_PORT` | number | 否 | `3306` | MySQL 端口 |
| `DB_USER` | string | **是** | — | MySQL 用户名 |
| `DB_PASSWORD` | string | **是** | — | MySQL 密码 |
| `DB_NAME` | string | **是** | `blank` | 数据库名 |
| **Redis** | | | | |
| `REDIS_HOST` | string | **是** | `127.0.0.1` | Redis 主机地址 |
| `REDIS_PORT` | number | 否 | `6379` | Redis 端口 |
| `REDIS_PASSWORD` | string | 否 | — | Redis 密码（无密码留空） |
| **JWT** | | | | |
| `JWT_SECRET` | string | **是** | — | JWT 签名密钥（生产环境请使用强随机字符串） |
| `JWT_EXPIRE` | string | 否 | `7d` | token 过期时间（如 `7d`, `24h`, `60m`） |
| **CORS** | | | | |
| `CORS_ORIGIN` | string | 否 | — | 额外允许的跨域来源，多个用逗号分隔。默认已允许 `localhost:3000` 和 `localhost:5173` |
| **邮箱** | | | | |
| `EMAIL_HOST` | string | **是** | — | SMTP 服务器地址 |
| `EMAIL_PORT` | number | 否 | `587` | SMTP 端口 |
| `EMAIL_SECURE` | boolean | 否 | `false` | 是否使用 SSL（465 端口设为 `true`） |
| `EMAIL_USER` | string | **是** | — | SMTP 账号 |
| `EMAIL_PASSWORD` | string | **是** | — | SMTP 密码或授权码 |
| `EMAIL_FROM` | string | **是** | — | 发件人显示格式：`名称 <邮箱地址>` |
| `EMAIL_VERIFY_EXPIRY` | number | 否 | `300` | 验证码有效期（秒） |
| `VERIFICATION_CODE_LENGTH` | number | 否 | `6` | 验证码长度 |
| **DashScope AI** | | | | |
| `DASHSCOPE_API_KEY` | string | 否 | — | 阿里云 DashScope API Key。不填则跳过 AI 内容审核 |
| **文件上传** | | | | |
| `UPLOAD_DIR` | string | 否 | `uploads` | 上传文件存储目录（相对于 `back/`） |
| `MAX_FILE_SIZE` | number | 否 | `10485760` | 单文件上传大小限制（字节），默认 10MB |
| **易支付 (ZPay)** | | | | |
| `ZPAY_BASE_URL` | string | 否 | — | 易支付网关地址 |
| `ZPAY_PID` | string | 否 | — | 易支付商户 ID |
| `ZPAY_PKEY` | string | 否 | — | 易支付商户密钥（用于签名） |
| `ZPAY_DEFAULT_TYPE` | string | 否 | `alipay` | 默认支付方式 |
| `ZPAY_CID` | string | 否 | — | 指定支付渠道 ID |
| `APP_BASE_URL` | string | 否 | — | 前端站点地址，支付成功后跳回 |
| `API_PUBLIC_BASE_URL` | string | 否 | — | 后端公网地址，用于异步回调通知 |

---

## 关键架构决策

### 内容审核流程

明信片创建后，状态设为 `reviewing`，异步调用 DashScope 的 qwen3.5-flash 模型审核图片内容、qwen-turbo 模型审核文字内容。审核通过自动转为 `sent`，不通过则标记为 `pending` 等待人工复审。未配置 `DASHSCOPE_API_KEY` 时跳过审核，直接通过。

### 软删除机制

明信片记录包含 `sender_deleted` 和 `recipient_deleted` 两个布尔字段。单方删除只是标记自己的字段为 `true`，仅当发件人和收件人**双方**都标记删除后，才会物理删除数据库记录。这确保了任何一方在删除后仍然可以从另一方的视角看到明信片。

### VIP 邮票免消耗

VIP 用户在创建明信片时，系统自动跳过邮票消耗检查。VIP 状态根据购买记录和有效期动态计算。

### 统一响应格式

后端所有响应通过 `utils/response.js` 的三个函数发出：
- `success(res, data, message)` —— 成功响应
- `error(res, message, statusCode)` —— 错误响应
- `paginate(res, data, pagination, message)` —— 分页响应

前端 Axios 实例自动处理 `code !== 0` 的错误情况。

### 自动数据库迁移

没有独立的迁移工具。`utils/schema.js` 中的 `ensureAppSchema()` 在每次服务启动时执行，按需添加缺失的列和表。这意味着：
- 部署新版本只需重启服务
- 不会删除已有列或表
- 新增列使用安全的 `ALTER TABLE ADD COLUMN IF NOT EXISTS`

---

## 参与贡献

欢迎一切形式的贡献！无论是功能建议、bug 修复、文档改进还是 UI 优化。

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

提交信息请遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具链相关

---

## 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

---

<p align="center">
  <sub>Made with care for everyone who still believes in the beauty of handwritten words.</sub>
</p>
