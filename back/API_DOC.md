# Blank 后端 API 接口文档

> **Base URL**: `http://localhost:3001/api`
>
> **认证方式**: Bearer Token（JWT）- 在请求头中添加 `Authorization: Bearer <token>`
>
> **统一响应格式**:
> ```json
> {
>   "code": 0,        // 0: 成功, -1: 失败
>   "message": "...",
>   "data": { ... }
> }
> ```

---

## 一、认证模块 `/api/auth`

### 1.1 发送验证码

```
POST /api/auth/verify
```

**请求体**:
```json
{ "email": "user@example.com" }
```

**响应**: `{ "code": 0, "message": "验证码已发送到您的邮箱" }`

**说明**: 验证码有效期 60 分钟，60 秒冷却期。Redis key: `blank:verify:{email}`

---

### 1.2 注册

```
POST /api/auth/register
```

**请求体**:
```json
{
  "username": "苏木",
  "email": "user@example.com",
  "password": "123456",
  "verifyCode": "123456"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGci...",
    "userInfo": {
      "id": 1,
      "uid": "1024520",
      "username": "苏木",
      "email": "user@example.com",
      "avatar": "",
      "vipLevel": "VIP 0",
      "coins": 100
    }
  }
}
```

---

### 1.3 登录

```
POST /api/auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGci...",
    "userInfo": {
      "id": 1, "uid": "1024520", "username": "苏木",
      "email": "user@example.com", "avatar": "...",
      "vipLevel": "VIP 0", "coins": 850
    }
  }
}
```

---

### 1.4 退出登录 🔒

```
POST /api/auth/logout
```

**响应**: `{ "code": 0, "message": "已退出登录" }`

---

### 1.5 忘记密码

```
POST /api/auth/forgot-password
```

**请求体**: `{ "email": "user@example.com" }`

---

### 1.6 重置密码

```
POST /api/auth/reset-password
```

**请求体**:
```json
{
  "email": "user@example.com",
  "verifyCode": "123456",
  "newPassword": "newpass123"
}
```

---

## 二、用户模块 `/api/user`

### 2.1 获取当前用户信息 🔒

```
GET /api/user/profile
```

**响应**:
```json
{
  "data": {
    "id": 1, "uid": "1024520", "username": "苏木",
    "email": "user@example.com", "avatar": "/uploads/avatars/xxx.jpg",
    "vipLevel": "VIP 0", "coins": 850,
    "gender": "男", "birthday": "2000-01-01",
    "location": "广东省", "profileVisibility": "所有人"
  }
}
```

### 2.2 更新个人资料 🔒

```
PUT /api/user/profile
```

**请求体** (字段可选):
```json
{
  "username": "新名字",
  "gender": "男",
  "birthday": "2000-01-01",
  "location": "广东省"
}
```

### 2.3 上传头像 🔒

```
PUT /api/user/avatar
Content-Type: multipart/form-data
```

**字段**: `avatar` (File)

**响应**: `{ "data": { "avatar": "/uploads/avatars/avatar_xxx.jpg" } }`

### 2.4 修改密码 🔒

```
PUT /api/user/password
```

**请求体**: `{ "oldPassword": "old123", "newPassword": "new123" }`

### 2.5 删除账号 🔒

```
DELETE /api/user/account
```

**请求体**: `{ "password": "123456" }`

### 2.6 获取用户统计 🔒

```
GET /api/user/stats
```

**响应**: `{ "data": { "sent": 42, "received": 128, "likes": 856 } }`

### 2.7 搜索用户 🔒

```
GET /api/user/search?keyword=苏木
```

**响应**:
```json
{
  "data": [
    { "id": 2, "uid": "1234567", "username": "苏木2", "avatar": "...", "vipLevel": "VIP 0" }
  ]
}
```

---

## 三、明信片模块 `/api/postcards`

### 3.1 发现列表

```
GET /api/postcards/discover?page=1&pageSize=20
```

**响应** (分页):
```json
{
  "data": {
    "list": [
      {
        "id": 1, "title": "美丽的日落",
        "image": "/uploads/postcards/xxx.jpg",
        "aspectRatio": "3/2", "postcardType": "normal",
        "imageOffset": { "x": 0, "y": 0 },
        "imageScale": 1, "imageRotation": 0,
        "author": { "id": 1, "uid": "1024520", "username": "苏木", "avatar": "..." },
        "likeCount": 42, "isLiked": false,
        "createdAt": "2026-04-01T12:00:00Z"
      }
    ],
    "pagination": { "total": 100, "page": 1, "pageSize": 20, "totalPages": 5 }
  }
}
```

### 3.2 漂流传递列表

```
GET /api/postcards/drifting?page=1&pageSize=20
```

**响应**: 同发现列表，增加 `elements`、`canvasWidth`、`canvasHeight` 字段

### 3.3 明信片详情

```
GET /api/postcards/detail/:id
```

**响应**: 完整明信片数据，含 `stamp`、`elements`、`isOwner` 等

### 3.4 创建明信片 🔒

```
POST /api/postcards
```

**请求体**:
```json
{
  "title": "美丽的日落",
  "imageUrl": "/uploads/postcards/xxx.jpg",
  "aspectRatio": "3/2",
  "postcardType": "normal",
  "elements": [],
  "canvasWidth": 600,
  "canvasHeight": 400,
  "imageOffsetX": 0, "imageOffsetY": 0,
  "imageScale": 1, "imageRotation": 0,
  "stampId": 1,
  "recipientInput": "1234567",
  "isPublic": true
}
```

### 3.5 删除明信片 🔒

```
DELETE /api/postcards/:id
```

### 3.6 批量删除 🔒

```
DELETE /api/postcards/batch
```

**请求体**: `{ "ids": [1, 2, 3] }`

### 3.7 收件箱 🔒

```
GET /api/postcards/my/inbox?page=1&pageSize=20
```

### 3.8 发件箱 🔒

```
GET /api/postcards/my/outbox?page=1&pageSize=20
```

### 3.9 点赞/取消点赞 🔒

```
POST /api/postcards/:id/like
```

**响应**: `{ "data": { "isLiked": true, "likeCount": 43 } }`

### 3.10 我的收藏 🔒

```
GET /api/postcards/my/favorites?page=1&pageSize=20
```

### 3.11 上传明信片图片 🔒

```
POST /api/postcards/upload-image
Content-Type: multipart/form-data
```

**字段**: `image` (File)

**响应**: `{ "data": { "imageUrl": "/uploads/postcards/postcard_xxx.jpg" } }`

### 3.12 添加漂流元素 🔒

```
PUT /api/postcards/:id/drift-element
```

**请求体**:
```json
{
  "element": {
    "type": "text",
    "content": "Hello World",
    "x": 100, "y": 100,
    "rotation": 0, "scale": 1,
    "fontSize": 16, "fontFamily": "Arial",
    "fontWeight": "normal", "fontStyle": "normal",
    "color": "#000000"
  }
}
```

### 3.13 删除漂流元素 🔒

```
DELETE /api/postcards/:id/drift-element/:idx
```

---

## 四、邮票模块 `/api/stamps`

### 4.1 获取所有邮票

```
GET /api/stamps?category=全部
```

**可选分类**: `全部`, `四季`, `猫狗`, `天气`, `心情`

**响应**:
```json
{
  "data": [
    {
      "id": 4, "seriesId": "四季", "title": "春天邮票",
      "desc": "春日繁花初绽插画...", "price": 5,
      "image": "/res/stamps/systemstamps/fourseason/春.png"
    }
  ]
}
```

### 4.2 我的邮票 🔒

```
GET /api/stamps/my
```

### 4.3 购买邮票 🔒

```
POST /api/stamps/purchase
```

**请求体**: `{ "stampId": 1, "quantity": 1 }`

**响应**: `{ "data": { "coins": 95, "stamp": { "id": 1, "title": "雨天邮票", "image": "..." } } }`

---

## 五、好友模块 `/api/friends`

### 5.1 好友列表 🔒

```
GET /api/friends
```

**响应**:
```json
{
  "data": [
    { "friendshipId": 1, "id": 2, "uid": "1234567", "username": "小明", "avatar": "...", "vipLevel": "VIP 0" }
  ]
}
```

### 5.2 待处理请求 🔒

```
GET /api/friends/pending
```

### 5.3 发送好友请求 🔒

```
POST /api/friends/request
```

**请求体**: `{ "userId": 2 }`

### 5.4 接受好友请求 🔒

```
PUT /api/friends/:id/accept
```

### 5.5 拒绝好友请求 🔒

```
PUT /api/friends/:id/reject
```

### 5.6 删除好友 🔒

```
DELETE /api/friends/:id
```

---

## 六、评论模块 `/api/comments`

### 6.1 获取评论列表

```
GET /api/comments/:postcardId
```

**响应**:
```json
{
  "data": [
    {
      "id": 1, "text": "真好看！", "author": "小明", "authorId": 2,
      "time": "2小时前", "likes": 5, "liked": false, "pinned": true
    }
  ]
}
```

### 6.2 发表评论 🔒

```
POST /api/comments/:postcardId
```

**请求体**: `{ "content": "真好看！" }`

### 6.3 删除评论 🔒

```
DELETE /api/comments/:id
```

### 6.4 置顶/取消置顶 🔒

```
PUT /api/comments/:id/pin
```

### 6.5 评论点赞 🔒

```
POST /api/comments/:id/like
```

---

## 七、签到模块 `/api/checkin`

### 7.1 获取签到状态 🔒

```
GET /api/checkin/status
```

**响应**:
```json
{
  "data": {
    "checkedDays": [1, 2, 3, 4],
    "isCheckedInToday": true,
    "consecutiveDays": 4,
    "month": 4,
    "year": 2026
  }
}
```

### 7.2 执行签到 🔒

```
POST /api/checkin
```

**响应**: `{ "data": { "coinsEarned": 10, "totalCoins": 860 }, "message": "签到成功！获得 10 邮分" }`

---

## 八、静态资源

| 路径 | 说明 |
|------|------|
| `/res/stamps/...` | 邮票图片 |
| `/res/sticker/...` | 贴纸素材 |
| `/res/font/...` | 字体文件 |
| `/uploads/avatars/...` | 用户头像 |
| `/uploads/postcards/...` | 明信片图片 |

---

## 九、健康检查

```
GET /api/health
```

**响应**: `{ "status": "ok", "timestamp": "2026-04-04T12:00:00Z" }`

---

> 🔒 标记表示该接口需要 JWT 认证（请求头携带 `Authorization: Bearer <token>`）
