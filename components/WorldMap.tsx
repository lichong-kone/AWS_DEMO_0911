"use client";

// Original stylized world map (no external assets — NFR-8).
// Coordinate space is equirectangular: viewBox 0 0 360 180, where a point at
// (lng, lat) maps to (lng + 180, 90 - lat). This matches the HTML pin overlay
// in the map page (x = (lng+180)/360, y = (90-lat)/180), so pins land on land.

// Continent outlines authored as rough lon/lat polygons, pre-converted to the
// 360x180 space. Deliberately painterly/simplified to suit the cozy aesthetic.
const CONTINENTS: string[] = [
  // North America
  "M12,25 L30,20 L55,20 L85,22 L100,28 L120,32 L125,40 L115,45 L108,50 L100,58 L99,65 L83,72 L75,67 L65,60 L56,50 L55,42 L45,32 Z",
  // South America
  "M100,82 L110,80 L120,85 L130,90 L145,95 L140,110 L122,125 L112,140 L107,135 L110,120 L102,105 L99,92 Z",
  // Europe
  "M170,54 L170,46 L175,42 L180,39 L182,32 L190,30 L208,30 L210,20 L222,24 L220,36 L208,45 L198,48 L188,52 Z",
  // Africa
  "M163,75 L175,55 L190,53 L200,58 L213,59 L223,78 L231,78 L222,92 L220,105 L215,115 L205,124 L198,124 L192,107 L188,86 L172,85 Z",
  // Asia
  "M220,36 L230,38 L240,32 L255,32 L275,28 L295,28 L313,35 L322,40 L320,45 L308,50 L302,60 L300,68 L288,75 L280,82 L275,75 L270,68 L260,82 L257,82 L252,70 L240,65 L225,62 L218,50 Z",
  // Australia
  "M293,112 L302,108 L313,102 L322,101 L327,110 L330,120 L325,128 L315,125 L303,124 L295,123 Z",
];

export function WorldMap({
  routePoints,
  className,
}: {
  routePoints?: { x: number; y: number }[]; // in 0-360 / 0-180 space
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 180"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9DC0CC" />
          <stop offset="100%" stopColor="#B7D0D6" />
        </linearGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7D08A" />
          <stop offset="100%" stopColor="#8FB061" />
        </linearGradient>
      </defs>

      {/* ocean */}
      <rect x="0" y="0" width="360" height="180" fill="url(#ocean)" />

      {/* faint lat/long graticule */}
      <g stroke="rgba(45,58,46,0.10)" strokeWidth="0.4">
        {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" />
        ))}
        {[30, 60, 90, 120, 150].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="360" y2={y} />
        ))}
      </g>

      {/* continents */}
      <g fill="url(#land)" stroke="#5B7F3B" strokeWidth="0.8" strokeLinejoin="round">
        {CONTINENTS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* dotted travel route through visited places (like the concept art) */}
      {routePoints && routePoints.length >= 2 && (
        <polyline
          points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#C96F4A"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
