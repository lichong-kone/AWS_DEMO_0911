#!/usr/bin/env bash
# Optimises the source postcard PNGs into two web-sized JPEGs each.
#
# The generated art is ~1448x1086 / ~2.9 MB per file. Thumbnails are rendered at
# 80-200px, so shipping the original would download ~2.9 MB to paint a thumb.
# This produces:
#   <id>.jpg        1400w q86  — album detail hero / summary modal
#   <id>-thumb.jpg   480w q78  — grids, inbox rows, map sidebar, home mail card
#
# Uses macOS `sips` (no extra dependency).
#
# Sources live in art-src/postcards/ — deliberately OUTSIDE public/, because
# anything under public/ is served to the browser and copied into the build
# output (29 MB of masters would ship with every deploy).
#
#   npm run build:postcards
set -euo pipefail

DIR="public/postcards"
SRC="art-src/postcards"

mkdir -p "$DIR"

if [[ ! -d "$SRC" ]]; then
  echo "no source directory at $SRC/ — nothing to optimise" >&2
  exit 1
fi

shopt -s nullglob
count=0
for src in "$SRC"/*.png; do
  id=$(basename "$src" .png)

  sips -s format jpeg -s formatOptions 86 --resampleWidth 1400 \
    "$src" --out "$DIR/$id.jpg" >/dev/null
  sips -s format jpeg -s formatOptions 78 --resampleWidth 480 \
    "$src" --out "$DIR/$id-thumb.jpg" >/dev/null

  full=$(du -h "$DIR/$id.jpg" | cut -f1 | tr -d ' ')
  thumb=$(du -h "$DIR/$id-thumb.jpg" | cut -f1 | tr -d ' ')
  echo "  $id  full=$full  thumb=$thumb"
  count=$((count + 1))
done

echo
echo "optimised $count postcards"
echo "sources kept in $SRC/ (gitignored, not served)"
