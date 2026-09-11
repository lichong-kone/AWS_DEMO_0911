import type {
  Destination,
  DestinationVisit,
  Packing,
  Season,
  Trip,
  TripStatus,
} from "@/lib/types";
import { DESTINATIONS, DESTINATION_MAP } from "@/lib/content/destinations";
import { ITEM_MAP } from "@/lib/content/items";
import { DURATIONS_MS, FACTORS, RETURN_LEG_FRACTION } from "./config";
import { createRng, makeSeed, rngInt, rngWeighted, type Rng } from "./rng";

// Two independent RNG streams derived from the stored trip seed, so both
// destination selection and reward content are reproducible (US-4.2).
export function destRngFor(seed: number): Rng {
  return createRng(seed);
}
export function productRngFor(seed: number): Rng {
  return createRng((seed ^ 0x9e3779b9) >>> 0);
}

export function currentSeason(now: number): Season {
  const m = new Date(now).getMonth(); // 0-11
  if (m <= 1 || m === 11) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
}

function tagsOf(packing: Packing): string[] {
  const ids = [packing.charm, packing.gearA, packing.gearB].filter(Boolean) as string[];
  const tags = new Set<string>();
  for (const id of ids) {
    const item = ITEM_MAP[id];
    if (item) item.tags.forEach((t) => tags.add(t));
  }
  return [...tags];
}

function foodRegions(packing: Packing): string[] {
  const f = packing.food ? ITEM_MAP[packing.food] : undefined;
  return f?.regionPref ?? [];
}

/** Score a single destination. rng supplies the RandomFactor. */
export function scoreDestination(
  d: Destination,
  packing: Packing,
  visits: Record<string, DestinationVisit>,
  season: Season,
  rng: Rng,
): number {
  const equipTags = tagsOf(packing);
  const regions = foodRegions(packing);

  // Base weight leans on distance tier / commonness.
  let score = d.distanceTier === "near" ? 1.2 : d.distanceTier === "far" ? 1.0 : 0.8;

  // EquipmentMatch: any gear/charm tag intersecting terrain?
  const equipHit = d.terrain.some((t) => equipTags.includes(t));
  score *= equipHit ? FACTORS.equipMatch : FACTORS.equipMiss;

  // FoodMatch
  if (regions.some((r) => d.regionPref.includes(r))) score *= FACTORS.foodMatch;

  // SeasonMatch
  if (d.season.includes(season)) score *= FACTORS.seasonMatch;
  else score *= FACTORS.seasonConflict;

  // NoveltyBoost
  const v = visits[d.id];
  score *= v ? 1 / (1 + FACTORS.noveltyDecay * v.count) : FACTORS.noveltyUnvisited;

  // RarityFactor
  score *= FACTORS.rarity[d.rarity] ?? 1;

  // RequiredTags soft gate
  if (d.requiredTags && d.requiredTags.length > 0) {
    const met = d.requiredTags.every((t) => equipTags.includes(t));
    if (!met) score *= FACTORS.requiredMissPenalty;
  }

  // RandomFactor
  score *= FACTORS.randomBase + rng() * FACTORS.randomSpread;

  return Math.max(0, score);
}

export function scoreDestinations(
  packing: Packing,
  visits: Record<string, DestinationVisit>,
  season: Season,
  rng: Rng,
): number[] {
  return DESTINATIONS.map((d) => scoreDestination(d, packing, visits, season, rng));
}

export interface StartTripInput {
  packing: Packing;
  now: number;
  visits: Record<string, DestinationVisit>;
  isFirstTrip: boolean;
}

export function startTrip(input: StartTripInput): Trip {
  const { packing, now, visits, isFirstTrip } = input;
  const seed = makeSeed();
  const rng = destRngFor(seed);
  const season = currentSeason(now);

  const weights = scoreDestinations(packing, visits, season, rng);
  const dest = rngWeighted(rng, DESTINATIONS, weights);

  const bucket = isFirstTrip
    ? DURATIONS_MS.first
    : dest.distanceTier === "near"
      ? DURATIONS_MS.near
      : dest.distanceTier === "far"
        ? DURATIONS_MS.far
        : DURATIONS_MS.rare;

  const travelMs = rngInt(rng, bucket.min, bucket.max);
  const returnMs = Math.round(travelMs * RETURN_LEG_FRACTION);
  const departAt = now;
  const arriveAt = departAt + travelMs;
  const returnAt = arriveAt + returnMs;

  return {
    id: `trip-${seed.toString(36)}-${departAt}`,
    seed,
    destinationId: dest.id,
    packing,
    departAt,
    arriveAt,
    returnAt,
    status: "TRAVELING",
    resolved: false,
  };
}

/** Pure: derive the status a trip should be in at time `now`. Idempotent. */
export function deriveStatus(trip: Trip, now: number): TripStatus {
  if (now < trip.arriveAt) return "TRAVELING";
  if (now < trip.returnAt) return "RETURNING";
  return "HOME_IDLE";
}

export function destinationOf(trip: Trip): Destination {
  return DESTINATION_MAP[trip.destinationId];
}
