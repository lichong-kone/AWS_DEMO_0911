# Froggy Trails Complete Design v3

这一版不是单页效果图，而是完整产品设计包。

## 先看这几个文件
1. `PRODUCT-FRAMEWORK.md` — 产品框架、路由、状态机
2. `PAGE-SPECS.md` — 15 个页面逐页设计 + 每页需要的元素
3. `ASSET-MATRIX.md` — 所有已经生成的 SVG 素材
4. `NON-SVG-BACKLOG.md` — 不能/不应该用 SVG 做的内容，以及替代方案
5. `IMPLEMENTATION-NOTES.md` — React/前端拆分建议
6. `index.html` — 本地打开即可浏览所有页面与素材

## 设计稿
- `screens/desktop/`：15 个完整页面
- `screens/mobile/`：6 个核心移动端页面

## 元素素材
- `assets/brand/`
- `assets/characters/`
- `assets/nav/`
- `assets/resources/`
- `assets/items/`
- `assets/decor/`
- `assets/map/`
- `assets/states/`
- `assets/badges/`
- `assets/souvenirs/`

## 关键原则
页面 SVG 是高保真设计参考；真正开发时把 UI 拆成 HTML/React，`assets/**` 中的 SVG 可以直接作为视觉资产使用。

## 更详细的产品文档
- `PAGE-SPECS.md`：15 页面逐页交互/状态/数据/素材/验收
- `USER-FLOWS.md`：核心用户流程
- `DATA-CONTRACTS.md`：实体与接口草案
- `DESIGN-TOKENS.md`：色板、字号、间距、动效 token
