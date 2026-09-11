import { describe, it, expect } from "vitest";
import { selectUnreadCount } from "@/lib/store/gameStore";
import { poseForState } from "@/components/Critter";
import { initialSave } from "@/lib/persistence/db";
import type { GameSave, Postcard } from "@/lib/types";

function pc(createdAt: number): Postcard {
  return {
    id: `p${createdAt}`,
    tripId: "t",
    destinationId: "kyoto",
    scene: "alley",
    pose: "walking",
    weather: "sunny",
    rarity: "common",
    diary: { zh: "x", en: "x" },
    createdAt,
  };
}

describe("selectUnreadCount", () => {
  it("counts nothing on a fresh save", () => {
    expect(selectUnreadCount(initialSave(0))).toBe(0);
  });

  it("counts postcards newer than the last read marker", () => {
    const save: GameSave = {
      ...initialSave(0),
      postcards: [pc(300), pc(200), pc(100)],
      lastReadMailAt: 150,
    };
    expect(selectUnreadCount(save)).toBe(2);
  });

  it("clears once the marker moves past the newest postcard", () => {
    const save: GameSave = {
      ...initialSave(0),
      postcards: [pc(300)],
      lastReadMailAt: 400,
    };
    expect(selectUnreadCount(save)).toBe(0);
  });

  it("treats mail as unread when the marker is absent (legacy saves)", () => {
    const save = { ...initialSave(0), postcards: [pc(10)] } as GameSave;
    delete save.lastReadMailAt;
    expect(selectUnreadCount(save)).toBe(1);
  });
});

describe("poseForState", () => {
  it("maps travel states to travel poses", () => {
    expect(poseForState("TRAVELING")).toBe("walking");
    expect(poseForState("RETURNING")).toBe("returning");
    expect(poseForState("PACK_READY")).toBe("packing");
  });

  it("prefers the mail pose when mail is waiting", () => {
    expect(poseForState("HOME_IDLE", { hasNewMail: true, hour: 23 })).toBe("mail");
  });

  it("sleeps at night when there is no mail", () => {
    expect(poseForState("HOME_IDLE", { hour: 23 })).toBe("sleeping");
    expect(poseForState("HOME_IDLE", { hour: 3 })).toBe("sleeping");
  });

  it("reads during the day", () => {
    expect(poseForState("HOME_IDLE", { hour: 10 })).toBe("reading");
    expect(poseForState("HOME_IDLE")).toBe("reading");
  });
});
