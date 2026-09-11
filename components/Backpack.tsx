"use client";

import { useGame } from "@/lib/store/gameStore";
import { ITEMS, ITEM_MAP } from "@/lib/content/items";
import { ItemIcon } from "./ItemIcon";
import { useModalDismiss } from "@/lib/hooks/useModalDismiss";
import { loc, t } from "@/lib/i18n";
import type { ItemSlot } from "@/lib/types";

type SlotKey = "food" | "charm" | "gearA" | "gearB";
const SLOTS: { key: SlotKey; label: string; itemSlot: ItemSlot }[] = [
  { key: "food", label: "slotFood", itemSlot: "food" },
  { key: "charm", label: "slotCharm", itemSlot: "charm" },
  { key: "gearA", label: "slotGearA", itemSlot: "gear" },
  { key: "gearB", label: "slotGearB", itemSlot: "gear" },
];

export function Backpack({ onClose }: { onClose: () => void }) {
  useModalDismiss(onClose);
  const lang = useGame((s) => s.save.settings.lang);
  const inventory = useGame((s) => s.save.inventory);
  const packing = useGame((s) => s.save.packing);
  const setPackSlot = useGame((s) => s.setPackSlot);
  const depart = useGame((s) => s.depart);

  const owned = ITEMS.filter((i) => (inventory[i.id] ?? 0) > 0 && !i.decorative);
  const hints = ([packing.charm, packing.gearA, packing.gearB, packing.food]
    .filter(Boolean) as string[])
    .map((id) => ITEM_MAP[id])
    .filter(Boolean)
    .map((it) => loc(it.hint, lang));

  const canDepart = !!packing.food;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <div className="paper-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-5 sm:w-[32rem]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-moss">{t("backpack", lang)}</h2>
          <button onClick={onClose} className="text-sm text-ink/50" aria-label={t("close", lang)}>✕</button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {SLOTS.map((slot) => {
            const current = packing[slot.key];
            return (
              <div key={slot.key} className="rounded-lg border border-ink/15 bg-white/50 p-2">
                <div className="mb-1 text-xs text-ink/50">{t(slot.label, lang)}</div>
                <div className="flex flex-wrap gap-1">
                  {owned
                    .filter((i) => i.slot === slot.itemSlot)
                    .map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setPackSlot(slot.key, current === i.id ? undefined : i.id)}
                        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors ${
                          current === i.id ? "border-clay bg-clay/15 text-clay" : "border-ink/20 text-ink/70"
                        }`}
                      >
                        <ItemIcon itemId={i.id} size={18} />
                        {loc(i.name, lang)}
                      </button>
                    ))}
                  {owned.filter((i) => i.slot === slot.itemSlot).length === 0 && (
                    <span className="text-xs text-ink/30">{t("empty", lang)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {hints.length > 0 && (
          <div className="mb-4 rounded-lg bg-leaf/15 p-3">
            <div className="mb-1 text-xs font-medium text-moss">{t("tendencies", lang)}</div>
            <ul className="space-y-0.5 text-xs italic text-ink/70">
              {hints.map((h, i) => (
                <li key={i}>· {h}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          disabled={!canDepart}
          onClick={() => {
            depart();
            onClose();
          }}
          className="w-full rounded-card bg-moss py-2.5 font-medium text-paper transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
        >
          {canDepart ? t("confirmDepart", lang) : t("needFood", lang)}
        </button>
      </div>
    </div>
  );
}
