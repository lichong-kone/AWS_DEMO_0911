import type { GameSave, Lang, Localized } from "@/lib/types";
import { DESTINATIONS } from "./destinations";

/** Badge art ids present in public/art/badges/. */
export type AchievementId =
  | "first-trip"
  | "first-postcard"
  | "ten-places"
  | "collector"
  | "aurora"
  | "rainy";

export interface Achievement {
  id: AchievementId;
  name: Localized;
  desc: Localized;
  /** current progress out of `goal` (for a progress bar) */
  progress: (s: GameSave) => number;
  goal: number;
}

const PLACE_GOAL = DESTINATIONS.length; // "see the whole map" — scales with content
const SOUVENIR_GOAL = 10;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-trip",
    name: { zh: "第一次出发", en: "First Departure" },
    desc: { zh: "送小家伙完成第一趟旅行", en: "Complete your first journey" },
    progress: (s) => Math.min(s.tickets, 1),
    goal: 1,
  },
  {
    id: "first-postcard",
    name: { zh: "第一封来信", en: "First Letter" },
    desc: { zh: "收到第一张明信片", en: "Receive your first postcard" },
    progress: (s) => Math.min(s.postcards.length, 1),
    goal: 1,
  },
  {
    id: "rainy",
    name: { zh: "雨天也好", en: "Rain Is Fine Too" },
    desc: { zh: "收到一张雨天的明信片", en: "Get a postcard sent in the rain" },
    progress: (s) => (s.postcards.some((p) => p.weather === "rainy") ? 1 : 0),
    goal: 1,
  },
  {
    id: "aurora",
    name: { zh: "星空信纸", en: "Starpaper" },
    desc: { zh: "收到一张星空纸明信片", en: "Receive a starpaper postcard" },
    progress: (s) => (s.postcards.some((p) => p.rarity === "starpaper") ? 1 : 0),
    goal: 1,
  },
  {
    id: "collector",
    name: { zh: "收藏家", en: "Collector" },
    desc: { zh: `收集 ${SOUVENIR_GOAL} 件纪念品`, en: `Collect ${SOUVENIR_GOAL} souvenirs` },
    progress: (s) => Math.min(s.souvenirs.length, SOUVENIR_GOAL),
    goal: SOUVENIR_GOAL,
  },
  {
    id: "ten-places",
    name: { zh: "走遍地图", en: "Whole Map" },
    desc: { zh: `去过 ${PLACE_GOAL} 个地方`, en: `Visit all ${PLACE_GOAL} places` },
    progress: (s) => Math.min(Object.keys(s.visits).length, PLACE_GOAL),
    goal: PLACE_GOAL,
  },
];

export interface AchievementState {
  id: AchievementId;
  name: Localized;
  desc: Localized;
  progress: number;
  goal: number;
  unlocked: boolean;
}

/** Pure: derive achievement state from the save. No extra persisted state. */
export function evaluateAchievements(save: GameSave): AchievementState[] {
  return ACHIEVEMENTS.map((a) => {
    const progress = a.progress(save);
    return {
      id: a.id,
      name: a.name,
      desc: a.desc,
      progress,
      goal: a.goal,
      unlocked: progress >= a.goal,
    };
  });
}

export function unlockedCount(save: GameSave): number {
  return evaluateAchievements(save).filter((a) => a.unlocked).length;
}

export function achievementText(v: Localized, lang: Lang): string {
  return lang === "en" ? v.en || v.zh : v.zh;
}
