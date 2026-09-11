import { openDB, type IDBPDatabase } from "idb";
import type { GameSave } from "@/lib/types";
import { SAVE_VERSION } from "@/lib/engine/config";

const DB_NAME = "froggy-trails";
const STORE = "save";
const KEY = "current";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof indexedDB === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

export function initialSave(now: number): GameSave {
  return {
    version: SAVE_VERSION,
    frogName: null,
    species: null,
    createdAt: null,
    clovers: 0,
    leaves: 0,
    stones: 0,
    tickets: 0,
    inventory: {},
    packing: {},
    currentTrip: null,
    postcards: [],
    souvenirs: [],
    visits: {},
    courtyardLastAccrual: now,
    courtyardPending: 0,
    settings: { reduceMotion: false, lang: "zh" },
    seenLossNotice: false,
    lastReadMailAt: 0,
  };
}

export async function loadGame(now: number): Promise<GameSave> {
  try {
    const db = await getDb();
    if (!db) return initialSave(now);
    const saved = (await db.get(STORE, KEY)) as GameSave | undefined;
    if (!saved || saved.version !== SAVE_VERSION) return initialSave(now);
    return saved;
  } catch {
    // corrupt / unavailable -> fall back to a fresh save (NFR-7)
    return initialSave(now);
  }
}

export async function saveGame(save: GameSave): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db.put(STORE, save, KEY);
  } catch {
    // best-effort; never throw into the UI
  }
}
