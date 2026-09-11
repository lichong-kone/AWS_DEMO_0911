# public/ — drop your generated art here

The app auto-uses a file if it exists, and falls back to built-in SVG/emoji if not.
Full prompts & specs: `aidlc-docs/design/asset-manifest.md`.

## P0 slots (wired now)
- `public/characters/frog.png` `otter.png` `hedgehog.png`  — transparent, 1024²
- `public/scenes/home-day.png`                              — courtyard bg, 4:3, no character
- `public/map/world.png`                                    — watercolor world map, STRICT 2:1, equirectangular, no text/markers
- `public/postcards/<destinationId>.png`                    — full scene w/ frog, 4:3
    ids: jp-countryside, kyoto, iceland, paris, swiss-valley, norway-fjord, chiang-mai, beijing-hutong, new-zealand, morocco

## P1 (wire on request)
- `public/items/<itemId>.png`, `public/souvenirs/<souvenirId>.png`, `public/brand/logo.png`, `public/icons/icon-192.png`, `public/icons/icon-512.png`

Just drop files and refresh — no code changes needed.
