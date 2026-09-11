import { describe, it, expect } from "vitest";
import { createRng } from "@/lib/engine/rng";
import {
  deriveStatus,
  productRngFor,
  scoreDestination,
  currentSeason,
} from "@/lib/engine/tripEngine";
import { buildProducts } from "@/lib/engine/contentResolver";
import { accrueCourtyard, purchase } from "@/lib/engine/economy";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { initialSave } from "@/lib/persistence/db";
import type { GameSave, Trip } from "@/lib/types";

describe("rng", () => {
  it("is deterministic for the same seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("differs for different seeds", () => {
    expect(createRng(1)()).not.toEqual(createRng(2)());
  });
});

describe("scoreDestination", () => {
  it("scores a cold destination higher when the right gear is packed", () => {
    const iceland = DESTINATION_MAP["iceland"];
    const withScarf = scoreDestination(iceland, { gearA: "scarf" }, {}, "winter", createRng(1));
    const bare = scoreDestination(iceland, {}, {}, "winter", createRng(1));
    expect(withScarf).toBeGreaterThan(bare);
  });
});

describe("trip products (reproducibility)", () => {
  const trip: Trip = {
    id: "trip-test",
    seed: 123456,
    destinationId: "kyoto",
    packing: {},
    departAt: 0,
    arriveAt: 1000,
    returnAt: 1400,
    status: "TRAVELING",
    resolved: false,
  };

  it("produces identical products for the same seed", () => {
    const dest = DESTINATION_MAP["kyoto"];
    const p1 = buildProducts(trip, dest, "autumn", productRngFor(trip.seed), trip.arriveAt);
    const p2 = buildProducts(trip, dest, "autumn", productRngFor(trip.seed), trip.arriveAt);
    expect(p1).toEqual(p2);
  });

  it("always yields at least one postcard and one souvenir (FR-5.6)", () => {
    const dest = DESTINATION_MAP["kyoto"];
    const p = buildProducts(trip, dest, "autumn", productRngFor(trip.seed), trip.arriveAt);
    expect(p.postcards.length).toBeGreaterThanOrEqual(1);
    expect(p.souvenirs.length).toBeGreaterThanOrEqual(1);
  });
});

describe("deriveStatus", () => {
  const trip: Trip = {
    id: "t",
    seed: 1,
    destinationId: "kyoto",
    packing: {},
    departAt: 0,
    arriveAt: 100,
    returnAt: 140,
    status: "TRAVELING",
    resolved: false,
  };

  it("transitions across the timeline", () => {
    expect(deriveStatus(trip, 50)).toBe("TRAVELING");
    expect(deriveStatus(trip, 120)).toBe("RETURNING");
    expect(deriveStatus(trip, 200)).toBe("HOME_IDLE");
  });

  it("is idempotent", () => {
    expect(deriveStatus(trip, 120)).toBe(deriveStatus(trip, 120));
  });
});

describe("currentSeason", () => {
  it("maps months to seasons", () => {
    expect(currentSeason(new Date("2026-01-15").getTime())).toBe("winter");
    expect(currentSeason(new Date("2026-04-15").getTime())).toBe("spring");
    expect(currentSeason(new Date("2026-07-15").getTime())).toBe("summer");
    expect(currentSeason(new Date("2026-10-15").getTime())).toBe("autumn");
  });
});

describe("economy", () => {
  const interval = 2 * 60_000;

  it("accrues clovers over time", () => {
    const save: GameSave = { ...initialSave(0), courtyardLastAccrual: 0, courtyardPending: 0 };
    const accr = accrueCourtyard(save, interval * 5);
    expect(accr.pending).toBe(5);
  });

  it("caps offline accrual (no loss, no runaway)", () => {
    const save: GameSave = { ...initialSave(0), courtyardLastAccrual: 0, courtyardPending: 0 };
    const accr = accrueCourtyard(save, interval * 10_000);
    expect(accr.pending).toBe(30); // ECONOMY.cloverCap
  });

  it("rejects a purchase with insufficient clovers", () => {
    const save: GameSave = { ...initialSave(0), clovers: 5 };
    const res = purchase(save, "scarf"); // price 10
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("insufficient");
    expect(res.clovers).toBe(5);
  });

  it("completes a valid purchase", () => {
    const save: GameSave = { ...initialSave(0), clovers: 20 };
    const res = purchase(save, "scarf");
    expect(res.ok).toBe(true);
    expect(res.clovers).toBe(10);
    expect(res.inventory["scarf"]).toBe(1);
  });
});
