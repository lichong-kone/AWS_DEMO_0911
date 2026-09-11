import type { Lang, Localized } from "@/lib/types";
import { DESTINATIONS } from "./destinations";

export type Category = "scenery" | "city" | "nature" | "food";

export const CATEGORY_LABEL: Record<Category, Localized> = {
  scenery: { zh: "风景", en: "Scenery" },
  city: { zh: "城市", en: "Cities" },
  nature: { zh: "自然", en: "Nature" },
  food: { zh: "美食", en: "Food" },
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  scenery: "🏞️",
  city: "🏙️",
  nature: "🌿",
  food: "🍜",
};

/** Which collection categories each destination contributes to. */
export const DEST_CATEGORIES: Record<string, Category[]> = {
  "jp-countryside": ["scenery", "nature"],
  kyoto: ["city", "scenery"],
  iceland: ["nature", "scenery"],
  paris: ["city", "food"],
  "swiss-valley": ["nature", "scenery"],
  "norway-fjord": ["nature", "scenery"],
  "chiang-mai": ["city", "food"],
  "beijing-hutong": ["city", "food"],
  "new-zealand": ["nature", "scenery"],
  morocco: ["nature", "food"],
};

export const ALL_CATEGORIES: Category[] = ["scenery", "city", "nature", "food"];

/** total destinations per category */
export function categoryTotals(): Record<Category, number> {
  const totals: Record<Category, number> = { scenery: 0, city: 0, nature: 0, food: 0 };
  for (const d of DESTINATIONS) {
    for (const c of DEST_CATEGORIES[d.id] ?? []) totals[c]++;
  }
  return totals;
}

/** visited destinations per category */
export function categoryProgress(visits: Record<string, unknown>): Record<Category, number> {
  const got: Record<Category, number> = { scenery: 0, city: 0, nature: 0, food: 0 };
  for (const id of Object.keys(visits)) {
    for (const c of DEST_CATEGORIES[id] ?? []) got[c]++;
  }
  return got;
}

export function categoryName(c: Category, lang: Lang): string {
  const v = CATEGORY_LABEL[c];
  return lang === "en" ? v.en : v.zh;
}
