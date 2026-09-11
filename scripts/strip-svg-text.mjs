// The design-v3 empty-state illustrations have hardcoded Chinese <text> baked in,
// which breaks the app's zh/en localization (an English player would see Chinese,
// and a Chinese player would see it duplicated next to our own caption).
//
// This strips the <text> nodes and writes "<name>-notext.svg" variants, so the
// artwork can be paired with localized captions rendered in HTML.
//
//   npm run build:states

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DIR = resolve(process.cwd(), "public/art/states");
const NAMES = ["empty-album", "empty-mail", "locked-destination"];

for (const name of NAMES) {
  const src = resolve(DIR, `${name}.svg`);
  const out = resolve(DIR, `${name}-notext.svg`);
  let svg = readFileSync(src, "utf8");

  const before = (svg.match(/<text/g) ?? []).length;
  // remove <text ...>...</text> (non-greedy, tolerates attributes/newlines)
  svg = svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>\s*/g, "");
  const after = (svg.match(/<text/g) ?? []).length;

  writeFileSync(out, svg, "utf8");
  console.log(`${name}: removed ${before - after} <text> node(s) -> ${name}-notext.svg`);
}
