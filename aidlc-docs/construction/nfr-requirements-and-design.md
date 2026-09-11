# NFR Requirements & Design (light) — v1

| NFR | 要求 | 设计落地 |
|---|---|---|
| NFR-1 平台 | 桌面优先 + 响应式 | Tailwind 断点,首页桌面 65/35 分栏,移动堆叠 |
| NFR-2 性能 | 首页快、动效不阻塞 | SSG/客户端渲染,内容懒加载,动效用 transform/opacity |
| NFR-3 离线 | 核心玩法离线可用 | 纯前端 + IndexedDB;无网络依赖(v1 不接外部 API) |
| NFR-5 无障碍 | 键盘可达/对比度/替代文本/减少动效 | 语义标签、focus 样式、alt、`prefers-reduced-motion` 与设置开关 |
| NFR-6 视觉 | 手帐 watercolor 一致 | Tailwind 主题令牌(PRD §25 配色),圆角卡片、弱阴影、手绘风 |
| NFR-7 确定性 | seed 复现、存档容错 | 注入 rng + 保存 seed;写入 try/catch,加载失败回退新档 |
| NFR-8 IP 合规 | 全原创 | 自绘 SVG/CSS 角色与纸张,不复刻《旅行青蛙》资产 |

**技术栈固化**:Next.js + React18 + TS(strict) + Tailwind + Framer Motion + Zustand + idb + Vitest。**Infrastructure Design 跳过**(v1 纯静态前端,部署到 Vercel/任意静态托管即可)。
