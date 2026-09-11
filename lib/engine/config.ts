// Tunable constants for the trip engine & economy (v1, compressed durations for demo).
// Real launch can scale MIN/MAX up to PRD's minutes/hours/days via these constants.

export const SAVE_VERSION = 2;

export const DURATIONS_MS = {
  first: { min: 30_000, max: 90_000 }, // 30s–90s (US-1.4 first trip)
  near: { min: 3 * 60_000, max: 8 * 60_000 }, // 3–8 min
  far: { min: 8 * 60_000, max: 20 * 60_000 }, // 8–20 min
  rare: { min: 20 * 60_000, max: 45 * 60_000 }, // 20–45 min
} as const;

// return leg is a fraction of the outbound travel time
export const RETURN_LEG_FRACTION = 0.4;

export const ECONOMY = {
  cloverIntervalMs: 2 * 60_000, // 1 clover per 2 min
  cloverCap: 30, // offline accrual capped -> no loss, no pressure (US-2.2)
  luckyChancePerAccrual: 0.05,
  dewChancePerAccrual: 0.15,
} as const;

export const STARTER = {
  clovers: 20,
  inventory: { bread: 1, bottle: 1 } as Record<string, number>,
};

// Destination scoring factor values (see functional-design.md §3)
export const FACTORS = {
  equipMatch: 1.6,
  equipMiss: 0.8,
  foodMatch: 1.4,
  seasonMatch: 1.3,
  seasonConflict: 0.7,
  noveltyUnvisited: 1.5,
  noveltyDecay: 0.4, // 1/(1+decay*count)
  rarity: { common: 1.0, uncommon: 0.6, rare: 0.3 } as Record<string, number>,
  requiredMissPenalty: 0.15,
  randomBase: 0.75,
  randomSpread: 0.5,
} as const;
