"use client";

import { create } from "zustand";
import type { FrogState, GameSave, ItemSlot, Lang, Species } from "@/lib/types";
import { initialSave, loadGame, saveGame } from "@/lib/persistence/db";
import { STARTER } from "@/lib/engine/config";
import { ITEM_MAP } from "@/lib/content/items";
import {
  currentSeason,
  deriveStatus,
  destinationOf,
  productRngFor,
  startTrip,
} from "@/lib/engine/tripEngine";
import { buildProducts } from "@/lib/engine/contentResolver";
import { accrueCourtyard, purchase } from "@/lib/engine/economy";

/** Transient (never persisted) wrap-up of a journey that just resolved. */
export interface TripSummary {
  tripId: string;
  destinationId: string;
  postcardIds: string[];
  souvenirIds: string[];
  isNewPlace: boolean;
  visitCount: number;
  departAt: number;
  returnAt: number;
}

interface GameStore {
  save: GameSave;
  ready: boolean;
  lastPurchaseError: string | null;
  /** set once when a trip's arrival is resolved; cleared by the UI */
  tripSummary: TripSummary | null;
  clearTripSummary: () => void;

  bootstrap: () => Promise<void>;
  sync: (now?: number) => void;

  selectSpecies: (s: Species) => void;
  nameFrog: (name: string) => void;
  setLang: (lang: Lang) => void;
  toggleReduceMotion: () => void;
  dismissLossNotice: () => void;
  markMailRead: () => void;

  harvest: () => void;
  setPackSlot: (slot: "food" | "charm" | "gearA" | "gearB", itemId: string | undefined) => void;
  depart: () => void;
  buy: (itemId: string) => void;
}

function frogState(save: GameSave, now: number): FrogState {
  if (!save.currentTrip) {
    const hasPack = !!(save.packing.food || save.packing.charm || save.packing.gearA || save.packing.gearB);
    return hasPack ? "PACK_READY" : "HOME_IDLE";
  }
  const s = deriveStatus(save.currentTrip, now);
  return s === "TRAVELING" ? "TRAVELING" : s === "RETURNING" ? "RETURNING" : "HOME_IDLE";
}

export function selectFrogState(save: GameSave): FrogState {
  return frogState(save, Date.now());
}

/** Postcards that arrived since the player last opened their mail. */
export function selectUnreadCount(save: GameSave): number {
  const since = save.lastReadMailAt ?? 0;
  return save.postcards.filter((p) => p.createdAt > since).length;
}

function persist(save: GameSave) {
  void saveGame(save);
}

export const useGame = create<GameStore>((set, get) => ({
  save: initialSave(Date.now()),
  ready: false,
  lastPurchaseError: null,
  tripSummary: null,

  clearTripSummary: () => set({ tripSummary: null }),

  bootstrap: async () => {
    const now = Date.now();
    const save = await loadGame(now);
    set({ save, ready: true });
    get().sync(now);
  },

  sync: (now = Date.now()) => {
    const prev = get().save;
    let save: GameSave = { ...prev };
    let summary: TripSummary | null = null;

    // 1) Courtyard accrual (capped, offline-safe)
    const accr = accrueCourtyard(save, now);
    save.courtyardPending = accr.pending;
    save.courtyardLastAccrual = accr.lastAccrual;
    save.leaves = save.leaves + accr.leaves;
    save.stones = save.stones + accr.stones;

    // 2) Trip lazy resolution
    if (save.currentTrip) {
      const trip = { ...save.currentTrip };
      const status = deriveStatus(trip, now);

      if (now >= trip.arriveAt && !trip.resolved) {
        const dest = destinationOf(trip);
        const rng = productRngFor(trip.seed);
        const products = buildProducts(trip, dest, currentSeason(trip.arriveAt), rng, trip.arriveAt);

        const existing = new Set(save.postcards.map((p) => p.id));
        const newCards = products.postcards.filter((p) => !existing.has(p.id));
        save.postcards = [...newCards, ...save.postcards];
        save.souvenirs = [...products.souvenirs, ...save.souvenirs];

        const v = save.visits[dest.id];
        const count = (v?.count ?? 0) + 1;
        save.visits = {
          ...save.visits,
          [dest.id]: {
            destinationId: dest.id,
            count,
            status: count >= 5 ? "collected" : count >= 3 ? "frequent" : "visited",
          },
        };
        save.tickets = save.tickets + 1; // 旅行券: one per completed journey

        // one-shot wrap-up for the UI (transient, never persisted)
        summary = {
          tripId: trip.id,
          destinationId: dest.id,
          postcardIds: products.postcards.map((p) => p.id),
          souvenirIds: products.souvenirs.map((s) => s.souvenirId),
          isNewPlace: !v,
          visitCount: count,
          departAt: trip.departAt,
          returnAt: trip.returnAt,
        };

        trip.resolved = true;
      }

      trip.status = status;
      if (status === "HOME_IDLE") {
        save.currentTrip = null;
        save.packing = {};
      } else {
        save.currentTrip = trip;
      }
    }

    set(summary ? { save, tripSummary: summary } : { save });
    persist(save);
  },

  selectSpecies: (s) => {
    const save = { ...get().save, species: s };
    set({ save });
    persist(save);
  },

  nameFrog: (name) => {
    const prev = get().save;
    const save: GameSave = {
      ...prev,
      frogName: name.trim() || (prev.settings.lang === "en" ? "Little One" : "小满"),
      createdAt: Date.now(),
      clovers: STARTER.clovers,
      inventory: { ...STARTER.inventory },
    };
    set({ save });
    persist(save);
  },

  setLang: (lang) => {
    const save = { ...get().save, settings: { ...get().save.settings, lang } };
    set({ save });
    persist(save);
  },

  toggleReduceMotion: () => {
    const prev = get().save;
    const save = { ...prev, settings: { ...prev.settings, reduceMotion: !prev.settings.reduceMotion } };
    set({ save });
    persist(save);
  },

  dismissLossNotice: () => {
    const save = { ...get().save, seenLossNotice: true };
    set({ save });
    persist(save);
  },

  markMailRead: () => {
    const save = { ...get().save, lastReadMailAt: Date.now() };
    set({ save });
    persist(save);
  },

  harvest: () => {
    const prev = get().save;
    const save: GameSave = {
      ...prev,
      clovers: prev.clovers + prev.courtyardPending,
      courtyardPending: 0,
    };
    set({ save });
    persist(save);
  },

  setPackSlot: (slot, itemId) => {
    const prev = get().save;
    if (itemId) {
      const item = ITEM_MAP[itemId];
      if (!item) return;
      const expected: ItemSlot = slot === "food" ? "food" : slot === "charm" ? "charm" : "gear";
      if (item.slot !== expected) return;
    }
    const save: GameSave = { ...prev, packing: { ...prev.packing, [slot]: itemId } };
    set({ save });
    persist(save);
  },

  depart: () => {
    const prev = get().save;
    if (prev.currentTrip) return;
    const now = Date.now();
    const isFirstTrip = prev.postcards.length === 0 && Object.keys(prev.visits).length === 0;
    const trip = startTrip({ packing: prev.packing, now, visits: prev.visits, isFirstTrip });
    const save: GameSave = { ...prev, currentTrip: trip };
    set({ save });
    persist(save);
  },

  buy: (itemId) => {
    const prev = get().save;
    const res = purchase(prev, itemId);
    if (!res.ok) {
      set({ lastPurchaseError: res.reason ?? "error" });
      return;
    }
    const save: GameSave = { ...prev, clovers: res.clovers, inventory: res.inventory };
    set({ save, lastPurchaseError: null });
    persist(save);
  },
}));
