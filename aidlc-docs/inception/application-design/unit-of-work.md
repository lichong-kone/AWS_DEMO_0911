# Units of Work — 蛙游记 Froggy Trails (v1)

**部署模型**:单一前端应用(monolith SPA/SSG),一个可部署单元。以下为其**逻辑模块**(便于开发与代码组织),非独立部署服务。

## 代码组织策略(Greenfield)
```
/ (workspace root)
├── app/                     # Next.js App Router 页面
│   ├── layout.tsx, page.tsx (小屋)
│   ├── map/page.tsx, album/page.tsx, shop/page.tsx, me/page.tsx
├── components/              # UI 组件(见 application-design)
├── lib/
│   ├── engine/              # 领域引擎(纯 TS):rng, tripEngine, contentResolver, economy
│   ├── store/               # Zustand gameStore
│   ├── persistence/         # IndexedDB repositories
│   ├── content/             # 静态种子:destinations, items, postcards, souvenirs, diaries
│   ├── i18n/                # 字典 + 解析
│   └── types.ts             # 领域类型
├── lib/engine/__tests__/    # Vitest 单测
└── (config: next, tailwind, tsconfig, vitest)
```

## 逻辑模块(Modules)

| Module | 内容 | 覆盖故事 |
|---|---|---|
| M1 Core & Persistence | 类型、gameStore、IndexedDB、启动加载/sync | US-9.1, US-10.1, US-4.2 |
| M2 Onboarding | 选伙伴/命名/新手道具/引导首旅 | US-1.1~1.4 |
| M3 Home & Economy | 小屋场景、状态栏、庭院采集、动效、商店 | US-2.1~2.3, US-8.1 |
| M4 Trip Engine | 目的地评分、开始旅行、惰性推进/结算、氛围状态 | US-3.3, US-4.1~4.3 |
| M5 Backpack | 四槽位、库存、模糊提示、确认出发 | US-3.1~3.3 |
| M6 Content & Rewards | 明信片(滑入/稀有)、纪念品、日记、种子内容 | US-5.1~5.4 |
| M7 Collection | 地图点亮、相册手帐 | US-6.1, US-6.2 |
| M8 Share | 分享卡生成 | US-7.1 |
| M9 Cross-cutting | i18n 双语、设置、无障碍/减少动效、丢档提示、视觉一致 | US-9.2, US-10.2~10.4 |
