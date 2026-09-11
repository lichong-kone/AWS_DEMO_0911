# Application Design — 蛙游记 Froggy Trails (v1)

纯前端架构(Next.js App Router + React + TS + Tailwind + Framer Motion),数据落 IndexedDB,领域逻辑为可测试的纯函数,内容为静态种子数据。

## 架构分层

```
UI 组件层 (React)                — 页面与交互,读写 Store
   │
状态编排层 (Zustand store)        — gameStore:动作 → 调用领域引擎 → 更新状态 → 持久化
   │
领域引擎层 (纯 TS,可测试)         — rng / tripEngine / contentResolver / economy
   │
持久化层 (IndexedDB via idb)      — repositories:profile/trips/postcards/souvenirs/visits/settings
   │
内容层 (静态种子数据)             — destinations / items / postcards / souvenirs / diaries (含 i18n 文案)
```

关键原则:领域引擎**纯函数 + 注入的 seeded RNG**,确保确定性可复现(NFR-7);持久化与内容与逻辑解耦(NFR-4);离线可玩(NFR-3)。

## 组件(UI)

| 组件 | 职责 | 相关故事 |
|---|---|---|
| `AppShell` / `Nav` | 全局布局、导航(小屋/地图/相册/商店/我的)、语言切换 | US-2.1, US-9.2 |
| `OnboardingFlow` | 选伙伴→命名→发新手道具→引导首旅 | US-1.1~1.4 |
| `HomeScene` | 庭院/小屋/伙伴/邮箱场景 + 氛围动效 + 一键采集 | US-2.1~2.3 |
| `StatusPanel` | 伙伴名/心情/状态/资源/准备行囊入口/最近明信片/未读 | US-2.1 |
| `BackpackPanel` | 四槽位 + 库存,模糊倾向提示,确认出发 | US-3.1~3.3 |
| `TravelStatus` | 旅行中氛围文字状态 | US-4.1 |
| `PostcardReveal` | 明信片卡片滑入呈现 | US-5.1, US-5.2 |
| `MapView` | 世界地图迷雾点亮、地点状态 | US-6.2 |
| `AlbumView` | 手帐跨页(左图右记) | US-6.1 |
| `ShareCard` | 生成/下载分享卡 | US-7.1 |
| `ShopView` | 软货币购买 | US-8.1 |
| `SettingsPanel` | 语言、丢档提示、减少动效 | US-9.2, US-10.2, US-10.3 |

## 服务 / 领域模块

| 模块 | 关键方法(签名概要) | 职责 |
|---|---|---|
| `rng` | `createRng(seed:number) => () => number` | mulberry32 确定性 RNG |
| `tripEngine` | `scoreDestinations(ctx)`, `startTrip(input)`, `resolveTrip(trip, now)`, `advanceState(trip, now)` | 目的地评分、开始旅行、惰性推进与结算 |
| `contentResolver` | `buildPostcards(trip, dest, rng)`, `pickSouvenirs(dest, rng)`, `pickDiary(dest, weather, rng)` | 由种子内容组合明信片/纪念品/日记 |
| `economy` | `accrueCourtyard(state, now)`, `harvest(state)`, `purchase(state, itemId)` | 庭院产出、采集、商店购买 |
| `gameStore` | Zustand actions:`selectFrog`, `nameFrog`, `confirmPack`, `depart`, `sync(now)`, `openMailbox`, `buy`, `setLang` | 编排:调用引擎并持久化 |
| `persistence` | `loadGame()`, `saveGame(state)`(idb) | IndexedDB 读写、容错 |
| `i18n` | `t(key, lang)` | 中英文案解析,缺失回退中文 |

## 数据模型(本地,按 PRD §21 精简到 v1)

```
Profile { frogId, frogName, createdAt, clovers, lang, settings }
Frog(type) { id, species(frog/otter/hedgehog), displayName }
InventoryItem { itemId, qty }         // 引用 items 种子
Trip { id, seed, destinationId, packing{food,charm,gearA,gearB},
        departAt, arriveAt, returnAt, status }   // 保存 seed(FR-11.3)
Postcard { id, tripId, destinationId, scene, pose, weather, rarity, diaryKey, imageRef, createdAt }
Souvenir(user) { souvenirId, destinationId, obtainedAt }
DestinationVisit { destinationId, count, status }  // 未发现/听说/去过/多次/完成收藏
Settings { reduceMotion, lang }
```

内容种子(只读):`destinations[]`、`items[]`、`postcardScenes[]`、`souvenirs[]`、`diaries[]`,均带 `{zh,en}` 文案。

## 依赖与通信

- UI → gameStore(单向:组件 dispatch action);store → 领域引擎(纯函数调用)→ persistence(副作用)。
- 领域引擎**不**直接触碰 IndexedDB 或 React;所有随机性经注入的 `rng(seed)`。
- 应用启动:`loadGame()` → 若有进行中的 trip,`sync(now)` 惰性推进 → 渲染。
- 数据流:`depart()` 记录 seed+时间线 → `sync(now)` 依据 now 推进 `TRAVELING→RETURNING→HOME_IDLE` 并在到达点结算 `buildPostcards/pickSouvenirs`(用 `createRng(seed)`,确保复现)。

## 技术选型落地
- 框架:Next.js(App Router)+ React 18 + TypeScript(strict)
- 样式:Tailwind CSS(配置 PRD §25 配色)+ 少量 CSS 纹理
- 动效:Framer Motion(尊重 prefers-reduced-motion)
- 状态:Zustand
- 存储:IndexedDB(idb 封装)
- 测试:Vitest(领域引擎单测)
- i18n:轻量字典 + React context(不引重型 i18n 库)
