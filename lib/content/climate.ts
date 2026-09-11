import type { Lang } from "@/lib/types";

/** Plausible temperature range per climate band, for postcard detail display. */
const TEMP: Record<string, [number, number]> = {
  cold: [-2, 6],
  temperate: [12, 22],
  warm: [24, 32],
  arid: [18, 34],
};

export function tempRange(climate: string): string {
  const [lo, hi] = TEMP[climate] ?? [15, 25];
  return `${lo}℃ ~ ${hi}℃`;
}

const WEATHER_ICON: Record<string, string> = {
  sunny: "☀️",
  rainy: "🌧️",
  cloudy: "☁️",
  snowy: "❄️",
  starry: "✨",
};

export function weatherIcon(w: string): string {
  return WEATHER_ICON[w] ?? "☁️";
}

export function climateLabel(climate: string, lang: Lang): string {
  const zh: Record<string, string> = {
    cold: "寒冷",
    temperate: "温和",
    warm: "温暖",
    arid: "干燥",
  };
  return lang === "en" ? climate : (zh[climate] ?? climate);
}
