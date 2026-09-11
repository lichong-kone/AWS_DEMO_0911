import { describe, it, expect } from "vitest";
import { evaluateAchievements, unlockedCount } from "@/lib/content/achievements";
import { initialSave } from "@/lib/persistence/db";
import { DESTINATIONS } from "@/lib/content/destinations";
import type { GameSave, Postcard } from "@/lib/types";

function pc(over: Partial<Postcard> = {}): Postcard {
  return {
    id: `p${Math.random()}`,
    tripId: "t1",
    destinationId: "kyoto",
    scene: "alley",
    pose: "walking",
    weather: "sunny",
    rarity: "common",
    diary: { zh: "测试", en: "test" },
    createdAt: 0,
    ...over,
  };
}

describe("achievements", () => {
  it("starts fully locked on a fresh save", () => {
    const save = initialSave(0);
    expect(unlockedCount(save)).toBe(0);
    expect(evaluateAchievements(save).every((a) => !a.unlocked)).toBe(true);
  });

  it("unlocks first-trip once a journey completes (ticket earned)", () => {
    const save: GameSave = { ...initialSave(0), tickets: 1 };
    const a = evaluateAchievements(save).find((x) => x.id === "first-trip")!;
    expect(a.unlocked).toBe(true);
  });

  it("unlocks first-postcard on the first postcard", () => {
    const save: GameSave = { ...initialSave(0), postcards: [pc()] };
    const a = evaluateAchievements(save).find((x) => x.id === "first-postcard")!;
    expect(a.unlocked).toBe(true);
  });

  it("unlocks rainy only for a rainy postcard", () => {
    const dry: GameSave = { ...initialSave(0), postcards: [pc({ weather: "sunny" })] };
    const wet: GameSave = { ...initialSave(0), postcards: [pc({ weather: "rainy" })] };
    expect(evaluateAchievements(dry).find((x) => x.id === "rainy")!.unlocked).toBe(false);
    expect(evaluateAchievements(wet).find((x) => x.id === "rainy")!.unlocked).toBe(true);
  });

  it("unlocks aurora only for a starpaper postcard", () => {
    const common: GameSave = { ...initialSave(0), postcards: [pc({ rarity: "common" })] };
    const star: GameSave = { ...initialSave(0), postcards: [pc({ rarity: "starpaper" })] };
    expect(evaluateAchievements(common).find((x) => x.id === "aurora")!.unlocked).toBe(false);
    expect(evaluateAchievements(star).find((x) => x.id === "aurora")!.unlocked).toBe(true);
  });

  it("tracks collector progress and caps at the goal", () => {
    const save: GameSave = {
      ...initialSave(0),
      souvenirs: Array.from({ length: 4 }, () => ({
        souvenirId: "ky-fox",
        destinationId: "kyoto",
        obtainedAt: 0,
      })),
    };
    const a = evaluateAchievements(save).find((x) => x.id === "collector")!;
    expect(a.progress).toBe(4);
    expect(a.goal).toBe(10);
    expect(a.unlocked).toBe(false);

    const full: GameSave = {
      ...initialSave(0),
      souvenirs: Array.from({ length: 25 }, () => ({
        souvenirId: "ky-fox",
        destinationId: "kyoto",
        obtainedAt: 0,
      })),
    };
    const b = evaluateAchievements(full).find((x) => x.id === "collector")!;
    expect(b.progress).toBe(10); // capped
    expect(b.unlocked).toBe(true);
  });

  it("unlocks whole-map only after visiting every destination", () => {
    const visits: GameSave["visits"] = {};
    for (const d of DESTINATIONS) {
      visits[d.id] = { destinationId: d.id, count: 1, status: "visited" };
    }
    const save: GameSave = { ...initialSave(0), visits };
    const a = evaluateAchievements(save).find((x) => x.id === "ten-places")!;
    expect(a.goal).toBe(DESTINATIONS.length);
    expect(a.unlocked).toBe(true);
  });
});
