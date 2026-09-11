// Domain types — 蛙游记 Froggy Trails (v1)

export type Lang = "zh" | "en";
export type Localized = { zh: string; en: string };

export type Species = "frog" | "otter" | "hedgehog";

export type TripStatus = "TRAVELING" | "RETURNING" | "HOME_IDLE";
export type FrogState = "HOME_IDLE" | "PACK_READY" | "TRAVELING" | "RETURNING";

export type ItemSlot = "food" | "charm" | "gear";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Rarity = "common" | "uncommon" | "rare";
export type PostcardRarity = "common" | "gilded" | "starpaper" | "seasonal";
export type VisitStatus = "unknown" | "heard" | "visited" | "frequent" | "collected";

export interface Item {
  id: string;
  slot: ItemSlot;
  name: Localized;
  price: number; // clovers; 0 = not purchasable / starter
  tags: string[]; // e.g. "cold", "far", "photo", "rainproof"
  regionPref?: string[]; // food -> region preference
  hint: Localized; // fuzzy tendency hint (US-3.2)
  decorative?: boolean;
}

export interface Souvenir {
  id: string;
  name: Localized;
}

export interface Destination {
  id: string;
  country: Localized;
  city: Localized;
  lat: number;
  lng: number;
  climate: string; // "cold" | "temperate" | "warm" | "arid" ...
  terrain: string[]; // tags matched against gear
  season: Season[]; // preferred seasons
  regionPref: string[]; // matched against food.regionPref
  rarity: Rarity;
  distanceTier: "near" | "far" | "rare";
  requiredTags?: string[];
  blurb: Localized; // location knowledge
  scenes: string[]; // postcard scene keys
  souvenirPool: Souvenir[]; // 3-8
  diaries: Localized[]; // diary lines
}

export interface Packing {
  food?: string;
  charm?: string;
  gearA?: string;
  gearB?: string;
}

export interface Postcard {
  id: string;
  tripId: string;
  destinationId: string;
  scene: string;
  pose: string;
  weather: string;
  rarity: PostcardRarity;
  diary: Localized;
  createdAt: number;
  /** trip window, optional for saves created before this field existed */
  tripDepartAt?: number;
  tripReturnAt?: number;
}

export interface UserSouvenir {
  souvenirId: string;
  destinationId: string;
  obtainedAt: number;
}

export interface Trip {
  id: string;
  seed: number;
  destinationId: string;
  packing: Packing;
  departAt: number;
  arriveAt: number;
  returnAt: number;
  status: TripStatus;
  resolved: boolean; // whether arrival products have been applied
}

export interface DestinationVisit {
  destinationId: string;
  count: number;
  status: VisitStatus;
}

export interface Settings {
  reduceMotion: boolean;
  lang: Lang;
}

export interface GameSave {
  version: number;
  frogName: string | null;
  species: Species | null;
  createdAt: number | null;
  clovers: number; // 三叶草
  leaves: number; // 树叶
  stones: number; // 小石子
  tickets: number; // 旅行券

  inventory: Record<string, number>; // itemId -> qty
  packing: Packing;
  currentTrip: Trip | null;
  postcards: Postcard[];
  souvenirs: UserSouvenir[];
  visits: Record<string, DestinationVisit>;
  courtyardLastAccrual: number; // ms timestamp
  courtyardPending: number; // pending clovers not yet harvested
  settings: Settings;
  seenLossNotice: boolean;
  /** when the player last opened their mail; optional so old saves still load */
  lastReadMailAt?: number;
}
