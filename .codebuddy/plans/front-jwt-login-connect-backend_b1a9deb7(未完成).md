---
name: front-jwt-login-connect-backend
overview: 将 `front` 里的登录流程从本地模拟切换为真实 JWT 登录，并接通 `back` 的认证接口与受保护用户信息接口，补齐前端 token 持久化、登录态恢复和必要的跨域/路由保护处理。
todos:
  - id: fix-cors
    content: 调整 back/app.js CORS 白名单，放通前端开发端口联调
    status: pending
  - id: wire-jwt-login
    content: 使用 [subagent:code-explorer] 改造 Login.vue、user.ts，完成真实登录存储
    status: pending
    dependencies:
      - fix-cors
  - id: close-auth-loop
    content: 使用 [subagent:code-explorer] 新增 front/src/api/user.ts，并打通 Profile.vue 与 router 鉴权闭环
    status: pending
    dependencies:
      - wire-jwt-login
---

## User Requirements

- 将现有登录页的模拟登录改为真实登录，前端与现有认证接口连通。
- 登录成功后保存用户登录状态与令牌；登录失败时显示后端返回的错误信息。
- 未登录或令牌失效时，受保护内容应自动回到登录页；已登录后进入站内页面。
- 保持当前明信片式登录界面与主要交互风格，不做无关页面扩改。

## Product Overview

- 用户在登录页输入邮箱和密码后，页面显示处理中状态，并根据真实返回结果完成登录或提示失败。
- 登录后可稳定进入个人相关页面，页面展示真实账户资料，而不是本地模拟数据。
- 整体视觉继续沿用现有登录卡片、按钮状态和提示反馈，效果上从“假登录”切换为“真登录”。

## Core Features

- 真实登录请求与结果反馈
- 本地登录状态与令牌保存/清理
- 受保护页面的未登录拦截与登录回跳
- 使用登录令牌拉取真实用户资料并处理失效状态

## Tech Stack Selection

- 前端：Vue 3 + TypeScript + Vue Router + Element Plus，沿用现有 `front/src/api/request.ts` fetch 封装与 `front/src/store/user.ts` 组合式 store。
- 构建：Vite。工作区根 `vite.config.ts` 以 `front` 为 root；`front/package.json` 另有本地开发脚本，端口为 `3000`。
- 后端：Express + jsonwebtoken + MySQL + Redis。认证接口已存在于 `back/routes/auth.js`、`back/routes/user.js`。

## Implementation Approach

- 方案核心：保留 `front/src/pages/Login.vue` 当前 UI，只替换其模拟延时登录逻辑为真实 `/api/auth/login` 请求；继续复用 `front/src/api/request.ts` 的 Bearer 注入与 401 自动清理能力。
- 鉴权闭环：登录成功后把 `token + userInfo` 写入 `front/src/store/user.ts`；新增 `front/src/api/user.ts` 请求 `/api/user/profile`，让 `Profile.vue` 读取真实受保护数据；在 `front/src/router/routes.ts` 和 `front/src/router/index.ts` 中补充路由鉴权与登录回跳。
- 关键决策：
- 继续复用现有组合式 store，不引入新的状态管理模式，避免扩大改动面。
- 保持 `login(user, token?)` 兼容，避免影响当前登录外的其他调用路径。
- 后端只补 `back/app.js` 的 CORS 白名单兼容，优先复用已有登录、资料、退出接口，不重写控制器。
- 性能与可靠性：
- 登录与资料获取都是单次请求，前端令牌读写为 O(1)。
- 资料同步仅在进入受保护页面时触发，避免全局首屏增加额外请求。
- 401 统一在请求层处理，减少页面级重复判断，降低遗漏风险。

## Implementation Notes

- `front/src/store/user.ts` 当前已有未暂存改动，应在现有初始化/退出逻辑基础上增量修改，避免覆盖本地变更。
- 后端登录、退出、资料接口已具备可用返回结构：统一 `code/message/data`，前端直接复用并透传错误消息。
- `Profile.vue` 当前带有硬编码默认用户值，联调后应改为“真实数据 + 空值兜底”，避免未登录时出现假资料。
- `back/app.js` 当前默认 CORS origin 为 `http://localhost:5173`，而 `front/package.json` 的 dev 端口为 `3000`；应以白名单方式兼容实际开发 origin，避免浏览器跨域拦截。
- 保持 `front/src/api/request.ts` 现有 401 清 token 与跳转逻辑，避免在多个页面重复清理状态。

## Architecture Design

- API 层：
- `front/src/api/auth.ts` 继续负责登录/退出。
- `front/src/api/user.ts` 新增当前用户资料接口。
- 会话层：
- `front/src/store/user.ts` 负责用户信息、令牌持久化、退出清理、资料同步。
- 路由层：
- `front/src/router/routes.ts` 标记需要鉴权的页面。
- `front/src/router/index.ts` 统一前置守卫与登录回跳。
- 视图层：
- `front/src/pages/Login.vue` 发起真实登录。
- `front/src/pages/Profile.vue` 消费真实用户资料。
- 后端接入层：
- `back/app.js` 负责跨域放通。
- `/api/auth/login` 返回 JWT 与基础用户信息。
- `/api/user/profile` 校验 JWT 后返回完整用户资料。

## Directory Structure

### Directory Structure Summary

本次改动围绕“登录拿令牌 → 前端持久化 → 受保护接口带令牌 → 页面显示真实资料”展开，优先复用现有请求封装、store 和后端接口，不引入新的鉴权模式。

```text
e:/奇奇怪怪的项目/Blank/
├── back/
│   └── app.js  # [MODIFY] CORS 白名单与开发端口兼容配置。支持前端实际开发 origin，避免登录请求被浏览器跨域拦截；保持现有路由与中间件结构不变。
└── front/
    └── src/
        ├── api/
        │   └── user.ts  # [NEW] 当前登录用户接口封装。提供获取 `/api/user/profile` 的方法，复用现有 request.ts 自动附带 Authorization。
        ├── pages/
        │   ├── Login.vue  # [MODIFY] 替换模拟登录为真实登录请求。处理加载、错误提示、成功后写入用户信息与令牌，并保留现有明信片式界面。
        │   └── Profile.vue  # [MODIFY] 进入页面后拉取后端资料并更新 store。去掉依赖本地模拟默认值的展示逻辑，处理未登录与令牌失效跳转。
        ├── router/
        │   ├── index.ts  # [MODIFY] 增加全局前置守卫。统一处理 requiresAuth 页面拦截，以及已登录访问登录页时的重定向。
        │   └── routes.ts  # [MODIFY] 为需要鉴权的页面补充 route meta，至少覆盖 `/profile`，并保持现有路由组织方式。
        └── store/
            └── user.ts  # [MODIFY] 在现有 localStorage 初始化与退出逻辑上补齐会话管理；保持 `login(user, token?)` 兼容，必要时补充资料同步辅助方法。
```

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 复核登录页、资料页、路由与现有请求封装之间的真实依赖链，确保只修改必要文件。
- Expected outcome: 明确 JWT 登录、受保护资料请求、路由守卫的完整改动范围，减少联调遗漏与回归风险。