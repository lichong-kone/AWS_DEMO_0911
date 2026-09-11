import type { Item } from "@/lib/types";

// Starter + shop items. Tags feed the trip scoring (equipment/food match).
export const ITEMS: Item[] = [
  // Food
  {
    id: "bread",
    slot: "food",
    name: { zh: "果酱面包", en: "Jam Bread" },
    price: 0,
    tags: [],
    regionPref: ["europe"],
    hint: { zh: "也许会走得更远一些", en: "Maybe it will wander a little farther" },
  },
  {
    id: "riceball",
    slot: "food",
    name: { zh: "饭团", en: "Rice Ball" },
    price: 8,
    tags: [],
    regionPref: ["asia"],
    hint: { zh: "似乎更想念东方的味道", en: "Seems to miss eastern flavours" },
  },
  {
    id: "berrytart",
    slot: "food",
    name: { zh: "浆果塔", en: "Berry Tart" },
    price: 12,
    tags: ["far"],
    regionPref: ["nordic"],
    hint: { zh: "适合一段长长的旅程", en: "Fit for a long, long journey" },
  },
  // Charm
  {
    id: "fourleaf",
    slot: "charm",
    name: { zh: "四叶草", en: "Four-leaf Clover" },
    price: 0,
    tags: ["lucky"],
    hint: { zh: "也许会遇到少见的事", en: "Rare things may happen" },
  },
  {
    id: "bell",
    slot: "charm",
    name: { zh: "小铃铛", en: "Little Bell" },
    price: 10,
    tags: ["lucky"],
    hint: { zh: "路上似乎更热闹", en: "The road feels livelier" },
  },
  // Gear
  {
    id: "bottle",
    slot: "gear",
    name: { zh: "水壶", en: "Water Bottle" },
    price: 0,
    tags: ["arid", "warm"],
    hint: { zh: "干燥的地方也安心", en: "At ease even in dry places" },
  },
  {
    id: "scarf",
    slot: "gear",
    name: { zh: "围巾", en: "Scarf" },
    price: 10,
    tags: ["cold"],
    hint: { zh: "似乎适合寒冷地区", en: "Seems suited to cold regions" },
  },
  {
    id: "tent",
    slot: "gear",
    name: { zh: "帐篷", en: "Tent" },
    price: 16,
    tags: ["mountain", "far"],
    hint: { zh: "也许会在野外过夜", en: "May camp out in the wild" },
  },
  {
    id: "camera",
    slot: "gear",
    name: { zh: "相机", en: "Camera" },
    price: 14,
    tags: ["photo"],
    hint: { zh: "适合喜欢拍照的小家伙", en: "For a little one who loves photos" },
  },
  {
    id: "umbrella",
    slot: "gear",
    name: { zh: "油纸伞", en: "Paper Umbrella" },
    price: 12,
    tags: ["rainproof"],
    hint: { zh: "雨天也能安心一些", en: "Calmer even on rainy days" },
  },
  // Decorative (shop only)
  {
    id: "lantern",
    slot: "gear",
    name: { zh: "小灯笼(装饰)", en: "Lantern (decor)" },
    price: 20,
    tags: [],
    hint: { zh: "让小屋更温暖", en: "Makes the cottage cosier" },
    decorative: true,
  },
];

export const ITEM_MAP: Record<string, Item> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);
