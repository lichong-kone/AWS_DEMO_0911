# 非 SVG / 需要其他方式实现的素材清单

> 这部分不是“漏做”，而是因为它们用 SVG 做会降低效果或破坏准确性。以下给出明确路径、用途与实现方式。

## P0-1 首页水彩场景三层
- `public/illustrations/home/home-bg-far.webp`：天空、远山、海面；1600×1200。
- `public/illustrations/home/home-bg-mid.webp`：房子、石墙、树干；1600×1200，透明或同构图。
- `public/illustrations/home/home-bg-front.webp`：草地、花朵、前景叶片；1600×1200，透明。

推荐做法：以 `screens/desktop/02-home.svg` 为构图骨架，让绘图模型只替换场景绘画层；青蛙、邮箱、三叶草继续用 SVG 叠加。

## P0-2 真实世界地图
不能靠 AI 图片或手绘 SVG 保证经纬度精度。

实现：
`Natural Earth / OSM GeoJSON or Vector Tiles → MapLibre/D3 → 套本项目色板 → SVG pin/route/fog 叠加`

建议文件：
- `public/map/world-110m.geojson`
- 或使用 vector tile provider

## P0-3 10 个 common 明信片大图
路径建议：
- `public/postcards/jp-countryside-common-1.webp`
- `public/postcards/kyoto-common-1.webp`
- `public/postcards/iceland-common-1.webp`
- `public/postcards/paris-common-1.webp`
- `public/postcards/swiss-valley-common-1.webp`
- `public/postcards/norway-fjord-common-1.webp`
- `public/postcards/chiang-mai-common-1.webp`
- `public/postcards/beijing-hutong-common-1.webp`
- `public/postcards/new-zealand-common-1.webp`
- `public/postcards/morocco-common-1.webp`

统一规格：1024×768 或 1536×1152；不要文字、水印、UI；同一青蛙 Character Reference。

## P1 复杂角色动作
当动作超过 8–10 种时，不建议继续人工 SVG：
- 划船
- 打伞
- 坐火车
- 露营
- 拍照
- 吃东西
- 趴在窗边
- 和访客互动

建议：固定角色 Reference → 透明 WebP/PNG；或者 Rive/Spine。

## P1 纸张/木纹
- `public/textures/paper.webp`：512×512 seamless，2–6% opacity。
- `public/textures/wood.webp`：1024×256 seamless。

## P1/P2 明信片 rare / seasonal
继续按：`{destinationId}-{weather}-{season}-{rarity}-{index}.webp`。
稀有不是单纯“更闪亮”，应该来自：特殊天气、稀有行为、稀有同行者、特殊时间。
