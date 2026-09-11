import type { Lang, Souvenir } from "@/lib/types";
import { DESTINATIONS } from "./destinations";
import { loc } from "@/lib/i18n";

const MAP: Record<string, Souvenir> = {};
for (const d of DESTINATIONS) {
  for (const s of d.souvenirPool) MAP[s.id] = s;
}

export function SOUVENIR_NAME(id: string, lang: Lang): string {
  const s = MAP[id];
  return s ? loc(s.name, lang) : id;
}
