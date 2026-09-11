// Converts Natural Earth 110m land polygons (public domain) into a styled
// equirectangular SVG used as the world map base.
//   input : /tmp/ne_land.geojson  (ne_110m_land.geojson)
//   output: public/map/land-110m.svg
// Coordinate space: viewBox "0 0 360 180", x = lng + 180, y = 90 - lat.
// This matches the pin overlay math in app/map/page.tsx.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const IN = process.argv[2] ?? "/tmp/ne_land.geojson";
const OUT = resolve(process.cwd(), "public/map/land-110m.svg");

const geo = JSON.parse(readFileSync(IN, "utf8"));

const P = 2; // decimal precision -> keeps the file small
const fmt = (n) => Number(n.toFixed(P));

function ringToPath(ring) {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i];
    const x = fmt(lng + 180);
    const y = fmt(90 - lat);
    d += (i === 0 ? "M" : "L") + x + "," + y;
  }
  return d + "Z";
}

function geometryToPath(g) {
  if (!g) return "";
  if (g.type === "Polygon") return g.coordinates.map(ringToPath).join("");
  if (g.type === "MultiPolygon")
    return g.coordinates.map((poly) => poly.map(ringToPath).join("")).join("");
  return "";
}

const paths = geo.features.map((f) => geometryToPath(f.geometry)).filter(Boolean);
const landPath = paths.join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180" preserveAspectRatio="none">
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#A8C9D2"/>
      <stop offset="55%" stop-color="#B6D2D8"/>
      <stop offset="100%" stop-color="#A2C2CC"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C3D89B"/>
      <stop offset="60%" stop-color="#A7C66B"/>
      <stop offset="100%" stop-color="#93B45F"/>
    </linearGradient>
  </defs>

  <rect width="360" height="180" fill="url(#ocean)"/>

  <g stroke="rgba(45,58,46,0.10)" stroke-width="0.35">
    ${[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="180"/>`)
      .join("\n    ")}
    ${[30, 60, 90, 120, 150]
      .map((y) => `<line x1="0" y1="${y}" x2="360" y2="${y}"/>`)
      .join("\n    ")}
  </g>

  <path d="${landPath}" fill="url(#land)" stroke="#5B7F3B" stroke-width="0.28"
        stroke-linejoin="round" fill-rule="evenodd"/>
</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg, "utf8");
console.log(
  `wrote ${OUT}\n  features: ${geo.features.length}\n  size: ${(svg.length / 1024).toFixed(1)} KB`,
);
