#!/usr/bin/env bash
# Imports the 10 generated postcard illustrations into public/postcards/
# with the destinationId filenames the app expects.
#
# Mapping was established by visually identifying each image; the generation
# order happens to match the manifest order.
set -euo pipefail

SRC="froggy-trails-complete-design-v3/assets/resources/img"
DST="public/postcards"
mkdir -p "$DST"

# generated-timestamp  ->  destinationId
map=(
  "09_28_49:jp-countryside"
  "09_28_53:kyoto"
  "09_29_03:iceland"
  "09_29_14:paris"
  "09_29_20:swiss-valley"
  "09_29_23:norway-fjord"
  "09_29_26:chiang-mai"
  "09_29_28:beijing-hutong"
  "09_29_32:new-zealand"
  "09_29_34:morocco"
)

for entry in "${map[@]}"; do
  stamp="${entry%%:*}"
  id="${entry##*:}"
  # shellcheck disable=SC2086
  src=$(find "$SRC" -name "*${stamp}*.png" -print -quit)
  if [[ -z "$src" ]]; then
    echo "MISSING source for $id (stamp $stamp)" >&2
    exit 1
  fi
  cp "$src" "$DST/$id.png"
  echo "  $id.png  <-  $(basename "$src")"
done

echo
echo "imported $(ls -1 "$DST"/*.png | wc -l | tr -d ' ') postcards"
