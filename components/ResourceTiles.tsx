"use client";

import { useGame } from "@/lib/store/gameStore";
import { ResourceIcon } from "./ItemIcon";
import type { Lang } from "@/lib/types";

const LABELS: Record<string, { zh: string; en: string }> = {
  clover: { zh: "三叶草", en: "Clovers" },
  leaf: { zh: "树叶", en: "Leaves" },
  stone: { zh: "小石子", en: "Pebbles" },
  ticket: { zh: "旅行券", en: "Tickets" },
};

/** Four resource tiles, like the concept art. */
export function ResourceTiles({ lang }: { lang: Lang }) {
  const save = useGame((s) => s.save);

  const tiles = [
    { name: "clover" as const, value: save.clovers },
    { name: "leaf" as const, value: save.leaves },
    { name: "stone" as const, value: save.stones },
    { name: "ticket" as const, value: save.tickets },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 rounded-card border border-line bg-paper/70 p-2">
      {tiles.map((tile) => (
        <div key={tile.name} className="flex flex-col items-center gap-0.5 py-0.5">
          <div className="flex items-center gap-1">
            <ResourceIcon name={tile.name} size={16} />
            <span className="text-sm font-semibold text-ink">{tile.value}</span>
          </div>
          <span className="text-[10px] leading-none text-muted">
            {lang === "en" ? LABELS[tile.name].en : LABELS[tile.name].zh}
          </span>
        </div>
      ))}
    </div>
  );
}
