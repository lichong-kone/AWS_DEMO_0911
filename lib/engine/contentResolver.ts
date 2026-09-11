import type {
  Destination,
  Postcard,
  PostcardRarity,
  Season,
  Trip,
  UserSouvenir,
} from "@/lib/types";
import { rngInt, rngPick, rngWeighted, type Rng } from "./rng";

const POSES = ["waving", "napping", "walking", "gazing", "eating"];
const WEATHERS = ["sunny", "rainy", "cloudy", "snowy", "starry"];

function pickRarity(rng: Rng, destRarity: string): PostcardRarity {
  // rarer destinations skew towards special papers, but never gambling language.
  const options: PostcardRarity[] = ["common", "gilded", "starpaper", "seasonal"];
  const base =
    destRarity === "rare"
      ? [50, 25, 15, 10]
      : destRarity === "uncommon"
        ? [65, 20, 8, 7]
        : [80, 12, 4, 4];
  return rngWeighted(rng, options, base);
}

export interface TripProducts {
  postcards: Postcard[];
  souvenirs: UserSouvenir[];
}

/**
 * Deterministically build a trip's rewards from the product RNG stream.
 * Guarantees at least two of {story, place, collection} by always emitting
 * >=1 postcard (story+place) and >=1 souvenir (collection). (FR-5.6)
 */
export function buildProducts(
  trip: Trip,
  dest: Destination,
  season: Season,
  rng: Rng,
  now: number,
): TripProducts {
  // postcards: 0-2 en route + 0-1 on return, min 1 overall.
  let count = rngInt(rng, 0, 2) + rngInt(rng, 0, 1);
  if (count < 1) count = 1;

  const postcards: Postcard[] = [];
  for (let i = 0; i < count; i++) {
    const scene = rngPick(rng, dest.scenes);
    const pose = rngPick(rng, POSES);
    const weather = rngPick(rng, WEATHERS);
    const rarity = pickRarity(rng, dest.rarity);
    const diary = rngPick(rng, dest.diaries);
    postcards.push({
      id: `${trip.id}-pc-${i}`, // deterministic id -> dedupe on re-resolve
      tripId: trip.id,
      destinationId: dest.id,
      scene,
      pose,
      weather,
      rarity,
      diary,
      createdAt: now,
      tripDepartAt: trip.departAt,
      tripReturnAt: trip.returnAt,
    });
  }

  // souvenirs: 1-2 from pool
  const souvCount = Math.min(rngInt(rng, 1, 2), dest.souvenirPool.length);
  const chosen = new Set<string>();
  const souvenirs: UserSouvenir[] = [];
  let guard = 0;
  while (souvenirs.length < souvCount && guard < 20) {
    const s = rngPick(rng, dest.souvenirPool);
    if (!chosen.has(s.id)) {
      chosen.add(s.id);
      souvenirs.push({ souvenirId: s.id, destinationId: dest.id, obtainedAt: now });
    }
    guard++;
  }

  return { postcards, souvenirs };
}
