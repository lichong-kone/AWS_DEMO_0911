# AWS_DEMO_0911

# 蛙游记 Froggy Trails

养一只会独自旅行的小动物。你只负责替它收拾行囊,它会去真实世界里的某个地方,并偶尔给你寄回来一张明信片。

> 我没有时间去远方,但有一个小家伙正在替我看看世界。

一个 cozy、异步等待、以收集为驱动的 Web 应用。**v1 为纯前端**:所有数据存在浏览器 IndexedDB,无后端、无账号、无外部 API。

---

## 快速开始

```bash
npm install
npm run dev          # http://localhost:3000
```

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm start` | 运行生产构建 |
| `npm run typecheck` | TypeScript 检查 |
| `npm test` | 单元测试(Vitest,27 个) |
| `npm run build:map` | 由 Natural Earth 数据重新生成世界地图 SVG |
| `npm run build:postcards` | 由 `art-src/` 源图重新生成明信片的 web 尺寸 |
| `npm run build:states` | 剥离空状态 SVG 内嵌文字(生成 `-notext` 变体) |

---

## 核心玩法

```
收集三叶草 → 准备行囊 → 小蛙自主出发 → 等待(可离线)
   → 收到明信片 → 归来 → 获得纪念品 / 地点知识
   → 地图点亮 / 相册成长 → 再次出发
```

用户**不能直接选目的地**。行囊里的食物/护符/装备只影响概率,不可控本身就是体验。

---

## 技术栈

Next.js 14(App Router)· React 18 · TypeScript(strict)· Tailwind CSS · Framer Motion · Zustand · idb(IndexedDB)· Vitest

### 架构分层

```
UI 组件 (React)
   ↓
状态编排 (Zustand gameStore)
   ↓
领域引擎 (纯函数 + 注入 seeded RNG)   ← 单元测试集中在这层
   ↓
持久化 (IndexedDB)
   ↓
内容层 (静态种子数据,含 zh/en 双语)
```

**关键设计**:旅行结算是**客户端惰性 + 确定性可复现**的。出发时只记录时间线与 `random_seed`;任意时刻打开应用,引擎按当前时间推进状态并结算产物。相同 seed 必然得到相同结果(目的地、明信片、纪念品),因此离线、关页面、换时间打开都一致。

---

## 目录结构

```
app/                    # 页面路由
  page.tsx              #   小屋(首页)
  map/ map/[id]/        #   世界地图 / 地点详情
  album/ album/[id]/    #   旅行册 / 明信片跨页详情
  inbox/                #   邮箱
  souvenirs/            #   纪念品柜
  achievements/         #   纪念章
  shop/  me/            #   商店 / 我的
components/             # UI 组件
lib/
  engine/               # 领域引擎(rng / tripEngine / contentResolver / economy)
  store/                # Zustand + selectors
  persistence/          # IndexedDB
  content/              # 地点、道具、纪念品、分类、成就(双语)
  i18n.ts               # 中英文案
public/
  art/                  # 99 个 SVG(角色/道具/纪念品/图标/徽章/装饰)
  postcards/            # 明信片 web 尺寸(<id>.jpg 1400w + <id>-thumb.jpg 480w)
  map/land-110m.svg     # 真实世界地图(Natural Earth 生成)
art-src/postcards/      # 明信片原图 PNG 母版(不对外提供、不进构建产物)
scripts/                # 素材生成脚本
aidlc-docs/             # 需求 / 用户故事 / 设计 / 决策记录
```

---

## 图片资源约定

**明信片**:母版放 `art-src/postcards/<id>.png`,跑 `npm run build:postcards` 生成两档 web 尺寸(详情大图 ~700KB、缩略图 ~90KB)。缩略图出现在相册网格、邮箱、地图侧栏等处——直接用母版会让列表拉取 2.9MB/张。

**渲染兜底链**(缺图不会报错,自动降级):
- 明信片:`<id>.jpg` → `<id>.png` → emoji
- 首页场景:`scenes/home-day.png` → CSS 渐变 + SVG 小屋
- 世界地图:`map/world.png` → `map/land-110m.svg`(真实地理) → 手绘 SVG

**世界地图**基于 [Natural Earth](https://www.naturalearthdata.com/) `ne_110m_land`(公共领域),等距圆柱投影,`viewBox="0 0 360 180"`,与图钉的 `x = lng+180 / y = 90-lat` 换算一致。若要换成水彩底图,必须严格 2:1、满幅、无文字标记,否则图钉会偏位。

---

## v1 有意的边界

- 无后端 / 账号 / 云同步 —— **清除浏览器数据会丢档**(应用内已明确告知)
- 无实时地图 tile、天气、维基数据(用内置种子数据)
- 明信片为预制插画,非运行时 AI 生成
- 无 PWA 推送
- 商店**仅软货币,无任何真实支付**
- 10 个地点(数据结构可平滑扩展到 30+)

---

## 原创性

角色、美术、UI、世界观全部原创。不使用《旅行青蛙》的名称、角色造型、房间布局、商店 UI、明信片构图。保留的仅是机制层:自主旅行的小动物 + 异步等待 + 明信片反馈 + 收藏系统。

---

## 开发流程

本项目按 AI-DLC(AI 驱动开发生命周期)推进,需求、用户故事、设计决策与审计记录都在 `aidlc-docs/`。
