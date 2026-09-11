# Build Instructions — 蛙游记 Froggy Trails (v1)

## Prerequisites
- Node.js ≥ 18.18(建议 20.x)
- npm ≥ 9

## Install
```bash
npm install
```

## Develop
```bash
npm run dev        # http://localhost:3000 (开发服务器,请在自己的终端运行)
```

## Type check
```bash
npm run typecheck  # tsc --noEmit
```

## Production build
```bash
npm run build      # next build,产出静态优化页面
npm run start      # 本地起生产服务器验证
```

## Verified status (this build)
- `npm install`:216 包,已将 next 升到 **14.2.35**(修复安全公告)。
- `npm run typecheck`:通过(exit 0)。
- `npm run build`:成功,8 条路由全部预渲染为静态(/ , /map , /album , /shop , /me , 及内部路由)。
- `npm run start` 冒烟:/ /map /album /shop /me 均返回 **200**。

## Deploy
纯静态/前端应用,可部署到 Vercel 或任意静态托管(v1 无后端/环境变量依赖)。
