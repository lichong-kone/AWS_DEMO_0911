# 待生成图片清单 & Prompt — 蛙游记 Froggy Trails

> **状态**:代码里 99 个 SVG 素材(角色/道具/纪念品/图标/徽章/装饰)**已全部到位并用上**。
> 下面只剩 **3 类需要生成的绘画**。生成后按路径丢进 `public/`,**刷新即生效,不需要改代码**(有缺图兜底)。

| 优先级 | 数量 | 路径 | 站内用到的位置 |
|---|---|---|---|
| **P0** | 10 | `public/postcards/<id>.png` | 明信片卡、相册跨页、地点详情、地图缩略图、邮箱、旅行总结(**6 处**) |
| **P1** | 1 | `public/scenes/home-day.png` | 首页庭院大图(整屏左侧) |
| **P2** | 1 | `public/map/world.png` | 地图底图(**可选**,已有真实 GeoJSON 地图兜底) |

---

## 0. 通用规则(每次生成都带上)

### ⚠️ 铁律
1. **画面里不要有任何文字、字母、水印、UI、边框装饰**(文字由代码渲染,图上有字会和界面打架)
2. **原创角色**,不得复刻《旅行青蛙》的角色造型/构图
3. 输出 **PNG**

### 🎨 STYLE PREFIX(建议英文,粘在每条 prompt 前面)
```
Cozy storybook illustration, soft watercolor and gouache on warm textured paper,
gentle diffuse light, muted earthy palette — cream #F4EBD8, moss green #5B7F3B,
leaf green #A7C66B, terracotta #C96F4A, rainy blue #6A8EA0, deep ink green #2D3A2E,
rounded friendly shapes, delicate hand-drawn linework, vintage travel-journal mood,
painterly not vector, no text, no letters, no watermark, no UI, no border frame.
```

### 🐸 CHARACTER REFERENCE(明信片必须带上,保证全站是同一只蛙)
这段描述**精确对应站内角色 SVG 的配色**,请原样附在明信片 prompt 里:
```
The traveler is a small round cute frog: yellow-green body (#8FB65A) with a darker
green back (#4E7138), soft cream belly, two dusty-rose blush cheeks (#D98375),
big gentle dark eyes, calm friendly expression, soft ink-green outlines (#2D3A2E),
carrying a small terracotta-tan backpack (#C96F4A / #B77242). Roughly 1/5 to 1/4
of the frame, clearly visible but never a close-up portrait — it is a small
creature inside a big world.
```

> **建议流程**:先只生成 1 张(推荐冰岛),满意后**把它作为 character reference / 参考图**再生成其余 9 张,一致性会好很多。

---

# P0 — 10 张明信片(最高优先,一张图提升 6 处)

**统一规格**:`1024×768`(4:3 横构图)· PNG · 不透明 · 无文字
**命名**:`public/postcards/<destinationId>.png` — id 必须完全一致,否则匹配不到

每条 prompt = `STYLE PREFIX` + `CHARACTER REFERENCE` + 下面的场景描述。

---

### 1. `jp-countryside.png` — 日本乡间
```
The frog traveler napping peacefully on a grassy roadside in the Japanese
countryside. Golden-green rice fields stretching to low hills, swaying in the
wind like a sea. A small torii gate and wooden power poles far in the distance.
Hazy warm summer afternoon, cicada-buzzing heat, tiny wildflowers near the frog.
Horizontal 4:3.
```

### 2. `kyoto.png` — 京都
```
The frog traveler holding a small paper umbrella, standing on wet stone steps
beneath a tall red torii gate in Kyoto. Vermillion pillars, damp mossy stone
lanterns, red maple leaves scattered on the ground and drifting down. Soft autumn
drizzle, puddles reflecting the lanterns, quiet and hushed. Horizontal 4:3.
```

### 3. `iceland.png` — 冰岛·黑沙滩 ⭐建议先生成这张作为基准
```
The frog traveler wearing a knitted scarf that streams sideways in the wind,
standing on an Iceland black-sand beach. Dramatic dark basalt sea stacks rising
from grey-blue surf, pale foam on volcanic sand. A faint green aurora ribbon in
the deep twilight sky. Vast, windy, lonely but peaceful. Horizontal 4:3.
```

### 4. `paris.png` — 巴黎
```
The frog traveler sitting on a stone parapet along the Seine in Paris, beside old
green riverside bookstalls. A small cafe awning, Parisian rooftops and chimneys
behind, a plane tree dropping autumn leaves, one pigeon nearby. Soft late-afternoon
golden light on limestone. Horizontal 4:3.
```

### 5. `swiss-valley.png` — 瑞士山谷
```
The frog traveler lying back and resting in a bright alpine meadow scattered with
wildflowers. Snow-capped Swiss peaks behind, a small dark-wood cabin, two cows
with bells grazing on a green slope. Crisp clear air, high bright daylight,
enormous open sky. Horizontal 4:3.
```

### 6. `norway-fjord.png` — 挪威峡湾
```
The frog traveler sitting in a tiny wooden rowboat on a mirror-still deep blue
Norwegian fjord. Towering green-black cliffs on both sides plunging into the
water, thin waterfall threads, low drifting mist. Perfect reflections, immense
quiet scale. Horizontal 4:3.
```

### 7. `chiang-mai.png` — 清迈
```
The frog traveler walking through a warm Chiang Mai night market, glowing orange
paper lanterns strung overhead and reflecting on a dark river. Food stalls with
soft steam, a golden temple spire silhouetted behind. Gentle warm rain, wet
glistening pavement, cozy and alive. Horizontal 4:3.
```

### 8. `beijing-hutong.png` — 北京胡同
```
The frog traveler standing in a narrow Beijing hutong alley of grey brick walls
and a weathered red wooden gate. A big scholar tree overhead dappling the light,
a flock of pigeons sweeping across the warm sunset sky. Bicycles leaning on the
wall, quiet everyday neighbourhood feel. Horizontal 4:3.
```

### 9. `new-zealand.png` — 新西兰牧场
```
The frog traveler standing on impossibly green glowing New Zealand highlands,
rolling hills dotted with many small white sheep. A still mirror lake reflecting
the whole mountain range, silver ferns in the foreground. Fresh bright spring
light, huge sky with soft clouds. Horizontal 4:3.
```

### 10. `morocco.png` — 摩洛哥·撒哈拉边缘
```
The frog traveler small atop a rippled red Sahara-edge sand dune at night, under
an enormous star-filled sky with the Milky Way. A distant caravan camp with warm
lantern glow, one calm camel resting nearby. Cool blue night sand against warm
firelight. Horizontal 4:3.
```

---

# P1 — 首页庭院场景

**路径**:`public/scenes/home-day.png` · `1600×1200`(4:3)· PNG

### ⚠️ 这张的两条特殊要求
1. **不要画青蛙**(角色是独立 SVG 叠加上去的,要做眨眼/待机/睡觉等姿势切换)
2. **画面下方中间要留出空地**(青蛙和邮箱会站在那里,约占底部 1/4 宽度中央区域)

```
[STYLE PREFIX] +

A cozy cottage courtyard seen from just outside the gate. A small stone cottage
on the right with a warm green wooden door standing ajar and a softly glowing
window; climbing leaves and a big tree branch framing the top of the frame; a low
mossy stone wall; a watering can, terracotta flower pots and a wooden crate; a
patch of clover and small white flowers on the left; beyond the wall a bright
Mediterranean-blue sea bay with a few distant white houses and green hills, tiny
sailboat. Late-morning light, dappled shade, peaceful.
IMPORTANT: no characters, no animals, no people anywhere in the image. Keep the
lower-centre foreground open and uncluttered (empty stone path / grass), because
characters will be composited there. Horizontal 4:3.
```

*(可选补充 `public/scenes/home-dusk.png` — 同一构图的黄昏版,用于夜间氛围)*

---

# P2 — 水彩世界地图(可选)

**路径**:`public/map/world.png` · `2048×1024`(**严格 2:1**)· PNG

### ⚠️ 这张最容易失败,三条硬性要求
1. **严格 2:1**,且**满幅出血**——四周不能有留白、卷轴边框、装饰框
2. **标准等距圆柱投影(equirectangular / Plate Carrée)**,左右刚好 -180°~180°,上下 90°N~90°S
3. **绝对不能有文字、国名、图钉、标记**(城市图钉由代码按经纬度叠加,图上有标记会重影)

> 不满足这些,图钉会落错位置。**做不出来就别做**——现在的兜底是我用 Natural Earth 真实地理数据生成的地图,经纬度是准的。

```
[STYLE PREFIX] +

A hand-painted watercolor world map filling the entire frame edge to edge, in
full equirectangular (Plate Carrée) projection. All continents in soft sage and
moss green gouache with gentle irregular coastlines; oceans in muted rainy blue
with visible watercolor blooms and warm paper grain; very faint latitude and
longitude grid lines; tiny painted mountain ridges and small trees dotting the
landmasses. Antique travel-atlas mood.
IMPORTANT: absolutely no text, no country names, no labels, no pins, no markers,
no compass rose, no decorative border, no scroll edges, no vignette.
Exact 2:1 aspect ratio, full bleed.
```

---

## 放置与验证

```
public/
├── postcards/          ← 10 张 <destinationId>.png
├── scenes/home-day.png
└── map/world.png       (可选)
```

**destinationId 完整列表**(必须精确):
```
jp-countryside   kyoto        iceland      paris      swiss-valley
norway-fjord     chiang-mai   beijing-hutong   new-zealand   morocco
```

放好后刷新浏览器即可。想确认是否被读到:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/postcards/iceland.png
# 200 = 已生效;404 = 路径或文件名不对
```

渲染优先级(前者缺失自动降级到后者,不会报错):
- 明信片:`postcards/<id>.png` → emoji 占位
- 首页:`scenes/home-day.png` → CSS 渐变天空 + SVG 远山小屋
- 地图:`map/world.png` → `map/land-110m.svg`(真实地理) → 手绘 SVG
