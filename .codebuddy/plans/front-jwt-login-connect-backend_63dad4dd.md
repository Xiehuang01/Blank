---
name: front-jwt-login-connect-backend
overview: 在保持现有登录界面不大改的前提下，将前端认证链路改为基于 `axios` 的 `.js` API 封装：新增 `front/src/utils/request.js`，把 `front/src/api` 中相关接口从 `.ts` 改为 `.js`，并继续打通后端 JWT 登录、资料获取、路由鉴权与开发环境跨域。
todos:
  - id: migrate-api-layer
    content: 使用 [subagent:code-explorer] 迁移 front/src/api 为 axios 的 JS 接口层
    status: completed
  - id: build-request-core
    content: 实现 front/src/utils/request.js 与 user.ts 的令牌持久化闭环
    status: completed
    dependencies:
      - migrate-api-layer
  - id: wire-login-flow
    content: 改造 Login.vue 对接后端登录返回的 token 和 userInfo
    status: completed
    dependencies:
      - build-request-core
  - id: protect-routes-profile
    content: 使用 [subagent:code-explorer] 打通 user.js、Profile.vue 与全局路由鉴权
    status: completed
    dependencies:
      - wire-login-flow
  - id: fix-cors-verify
    content: 调整 back/app.js 跨域并验证登录、退出、401 跳转链路
    status: completed
    dependencies:
      - protect-routes-profile
---

## User Requirements

- 将 `front` 里的登录从本地模拟改为真实联调：提交邮箱和密码后，接入后端登录接口，拿到令牌并保存登录状态。
- 将 `front/src/api` 中现有相关 `.ts` 接口文件改为 `.js`，统一走新的公共请求封装；新增 `front/src/utils/request.js` 作为统一请求入口。
- 登录后需要能保持会话、刷新后恢复状态、请求时自动带上认证信息、失效后自动清空本地状态并回到登录页。
- 退出登录需调用后端退出接口，并同步清理前端登录状态。
- 保持当前明信片式登录界面和主要动效，不做无关页面重做。

## Product Overview

登录页继续保持现有卡片叠放、翻转和加载反馈的视觉效果，但提交动作改为真实请求。用户登录成功后进入已登录状态，个人信息不再使用伪造数据，而是来自后端返回或受保护接口获取的数据。令牌失效时，界面会回到登录页，避免出现“看起来已登录但接口不可用”的状态错位。

## Core Features

- 真实登录：调用后端认证接口，保存令牌和用户信息。
- 统一请求层：整理认证请求、用户请求与通用拦截逻辑。
- 登录态恢复：刷新页面后继续识别已登录用户。
- 鉴权闭环：受保护页面统一校验，未登录或令牌失效时跳转登录页。
- 退出闭环：调用后端退出接口并清空本地状态。

## Tech Stack Selection

- 前端延用现有 Vue 3 + Vite 架构。
- 状态延用当前组合式 store：`front/src/store/user.ts`，不引入新状态方案。
- 请求层按用户要求改为 Axios，并迁移到 `front/src/utils/request.js`。
- 后端延用现有 Express + JWT 认证接口。
- 已验证 `front/tsconfig.json` 启用 `allowJs`，`front/vite.config.ts` 已配置 `@` 别名，支持本次 JS 迁移。

## Implementation Approach

采用“最小改动接通认证链”的方式：保留现有登录页表现层，只替换其提交逻辑、请求层和登录态管理。前端以 `request.js` 为单一入口处理基础地址、令牌注入、统一响应、401 清理与跳转；页面和 store 只关心业务结果，避免散落重复逻辑。

关键决策：

- 复用现有 `user.ts` store，而不是引入 Pinia，降低改动面。
- 用后端登录返回的 `token + userInfo` 直接完成首屏登录；仅在需要校验或刷新资料时调用 `/api/user/profile`，避免重复请求。
- 在 `router` 中补全全局鉴权，而不是继续让页面各自 `onMounted` 校验，减少重复和漏网路由。
- 修正 `back/app.js` 的前端开发端口跨域问题，保证本地联调稳定。

性能与可靠性：

- 令牌读取、写入与请求头注入均为 O(1)。
- 统一拦截器只做一次 401 处理，避免多个页面重复清理和多次跳转。
- 不在每次路由切换都强制拉取用户资料，避免无意义网络请求。

## Implementation Notes

- 复用后端既有响应结构 `code / message / data`，不要另造前端解析规则。
- 不记录 token 到日志或消息提示中。
- 保留现有页面交互和提示风格，只替换模拟数据。
- 对已有未提交改动 `front/src/store/user.ts` 采用增量修改，避免覆盖用户本地改动。
- 若旧 `front/src/api/request.ts`、`front/src/api/auth.ts` 无残余引用，再安全清理，避免一次性大范围重构。

## Architecture Design

- 表现层：`Login.vue`、`Profile.vue`
- 请求层：`src/utils/request.js`、`src/api/auth.js`、`src/api/user.js`
- 状态层：`src/store/user.ts`
- 路由层：`src/router/routes.ts`、`src/router/index.ts`
- 后端接口层：`back/routes/auth.js`、`back/routes/user.js`、`back/app.js`

数据流：
登录页提交表单，调用认证 API，请求层自动处理鉴权头和响应；成功后写入 store 与本地存储；受保护页面通过路由守卫和用户接口完成登录态校验；退出时调用后端黑名单接口并清理本地状态。

## Directory Structure

### Directory Structure Summary

本次改造集中在前端认证链路与请求层迁移，后端仅做联调所需的跨域适配，不扩散到无关业务。

```text
front/
├── package.json                         # [MODIFY] 增加 axios 依赖，保持现有构建脚本不变。
├── src/
│   ├── utils/
│   │   └── request.js                   # [NEW] Axios 统一封装。负责 baseURL、Authorization 注入、统一响应解析、401 清理与跳转。
│   ├── api/
│   │   ├── auth.js                      # [NEW] 认证接口集合。封装登录、退出及现有认证相关请求，统一使用 request.post。
│   │   ├── user.js                      # [NEW] 用户接口集合。封装获取个人资料等受保护请求。
│   │   ├── auth.ts                      # [MODIFY] 旧 TS 接口层迁移出口，调用方切换完成后可清理。
│   │   └── request.ts                   # [MODIFY] 旧 fetch 封装退役，迁移 token 相关能力到 request.js 后清理残余引用。
│   ├── pages/
│   │   ├── Login.vue                    # [MODIFY] 将模拟登录改为真实请求，保留现有界面与反馈。
│   │   └── Profile.vue                  # [MODIFY] 对接真实用户信息与退出流程，移除重复页面级鉴权逻辑。
│   ├── router/
│   │   ├── routes.ts                    # [MODIFY] 为需登录页面补充鉴权标记。
│   │   └── index.ts                     # [MODIFY] 增加全局路由守卫，统一处理未登录访问。
│   └── store/
│       └── user.ts                      # [MODIFY] 适配新请求层，统一 token 持久化、登录恢复、退出清理和用户信息更新。
back/
└── app.js                               # [MODIFY] 调整 CORS 开发来源配置，保证前端 3000 端口可联调。
```

## Agent Extensions

- **code-explorer**
- Purpose: 扫描前端 API、store、router 与后端认证接口的真实调用链，确认迁移范围和受影响文件。
- Expected outcome: 产出完整的改造清单，确保 `.ts` 到 `.js` 迁移、JWT 接入、路由鉴权和跨域联调无遗漏。