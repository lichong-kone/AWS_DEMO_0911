import type { GameSave } from "@/lib/types";
import { ECONOMY } from "./config";
import { ITEM_MAP } from "@/lib/content/items";

export interface CourtyardAccrual {
  pending: number; // clovers waiting to be harvested
  leaves: number; // 树叶 gained
  stones: number; // 小石子 gained
  lastAccrual: number; // updated timestamp
}

/**
 * Accrue courtyard resources based on elapsed time. Capped so offline players
 * lose nothing and feel no pressure (US-2.2). Deterministic-ish luck via a
 * time-derived pseudo roll (kept simple; not seed-critical).
 */
export function accrueCourtyard(save: GameSave, now: number): CourtyardAccrual {
  const elapsed = Math.max(0, now - save.courtyardLastAccrual);
  const ticks = Math.floor(elapsed / ECONOMY.cloverIntervalMs);
  if (ticks <= 0) {
    return {
      pending: save.courtyardPending,
      leaves: 0,
      stones: 0,
      lastAccrual: save.courtyardLastAccrual,
    };
  }

  let pending = save.courtyardPending + ticks;
  if (pending > ECONOMY.cloverCap) pending = ECONOMY.cloverCap;

  // light, non-critical randomness from the tick index
  let leaves = 0;
  let stones = 0;
  for (let i = 0; i < ticks; i++) {
    const r = pseudo(now + i);
    if (r < ECONOMY.luckyChancePerAccrual) stones++;
    else if (r < ECONOMY.luckyChancePerAccrual + ECONOMY.dewChancePerAccrual) leaves++;
  }

  return {
    pending,
    leaves,
    stones,
    lastAccrual: save.courtyardLastAccrual + ticks * ECONOMY.cloverIntervalMs,
  };
}

function pseudo(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export interface PurchaseResult {
  ok: boolean;
  reason?: "insufficient" | "unknown-item";
  clovers: number;
  inventory: Record<string, number>;
}

export function purchase(save: GameSave, itemId: string): PurchaseResult {
  const item = ITEM_MAP[itemId];
  if (!item) return { ok: false, reason: "unknown-item", clovers: save.clovers, inventory: save.inventory };
  if (save.clovers < item.price) {
    return { ok: false, reason: "insufficient", clovers: save.clovers, inventory: save.inventory };
  }
  const inventory = { ...save.inventory, [itemId]: (save.inventory[itemId] ?? 0) + 1 };
  return { ok: true, clovers: save.clovers - item.price, inventory };
}
