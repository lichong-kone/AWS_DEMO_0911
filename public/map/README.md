# public/map

## land-110m.svg (generated, committed)
Real-world land outlines in equirectangular projection, `viewBox="0 0 360 180"`
so that a point at (lng, lat) maps to `x = lng + 180`, `y = 90 - lat` — the same
math the pin overlay uses in `app/map/page.tsx`.

**Source data**: [Natural Earth](https://www.naturalearthdata.com/) `ne_110m_land`
(1:110m land polygons), via the
[natural-earth-vector](https://github.com/nvkelso/natural-earth-vector) repository.
Natural Earth data is in the **public domain** (no attribution required, but credited here).

**Regenerate**:
```bash
curl -sL -o /tmp/ne_land.geojson \
  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
npm run build:map            # writes public/map/land-110m.svg
```

## world.png (optional, you provide)
If you drop a watercolor world map here it takes priority over `land-110m.svg`.
Requirements so pins stay accurate:
- **strict 2:1 aspect** (e.g. 2048×1024)
- **full equirectangular projection**, edge to edge, no decorative border
- **no text, no labels, no markers**

Render order in the app: `world.png` → `land-110m.svg` → built-in hand-drawn SVG.
