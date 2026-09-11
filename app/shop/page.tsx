"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { ITEMS } from "@/lib/content/items";
import { ItemIcon, ResourceIcon } from "@/components/ItemIcon";
import { AssetImage } from "@/components/AssetImage";
import { Critter } from "@/components/Critter";
import { loc, t } from "@/lib/i18n";
import type { Item } from "@/lib/types";

type ShopTab = "all" | "food" | "charm" | "gear" | "decor";

const TABS: { id: ShopTab; zh: string; en: string; emoji: string }[] = [
  { id: "all", zh: "全部", en: "All", emoji: "🧺" },
  { id: "food", zh: "食物", en: "Food", emoji: "🍞" },
  { id: "charm", zh: "护符", en: "Charms", emoji: "🍀" },
  { id: "gear", zh: "装备", en: "Gear", emoji: "🎒" },
  { id: "decor", zh: "装饰", en: "Decor", emoji: "🏮" },
];

function matches(item: Item, tab: ShopTab): boolean {
  if (tab === "all") return true;
  if (tab === "decor") return !!item.decorative;
  if (item.decorative) return false;
  return item.slot === tab;
}

export default function ShopPage() {
  const save = useGame((s) => s.save);
  const buy = useGame((s) => s.buy);
  const err = useGame((s) => s.lastPurchaseError);
  const lang = save.settings.lang;
  const [tab, setTab] = useState<ShopTab>("all");
  const [justBought, setJustBought] = useState<string | null>(null);

  const forSale = useMemo(() => ITEMS.filter((i) => i.price > 0 && matches(i, tab)), [tab]);

  if (!save.createdAt || !save.species) return null;

  const onBuy = (id: string) => {
    buy(id);
    setJustBought(id);
    setTimeout(() => setJustBought(null), 1200);
  };

  return (
    <div className="grid lg:h-[calc(100vh-2.75rem)] lg:grid-cols-[1fr_300px]">
      {/* ============ Shelves ============ */}
      <section className="min-h-[60vh] overflow-y-auto px-4 py-4 lg:min-h-0">
        <div className="mb-1 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight text-ink">
              {lang === "en" ? "Village store" : "杂货铺"}
            </h1>
            <p className="text-sm text-muted">
              {lang === "en" ? "little things for a long journey" : "为远行准备一点小东西"}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper-light px-3 py-1.5 text-sm text-moss shadow-sm">
            <ResourceIcon name="clover" size={16} /> {save.clovers}
          </span>
        </div>

        {/* category tabs */}
        <div className="mb-3 mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tb) => {
            const active = tab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-moss text-paper"
                    : "border border-line bg-paper-light text-ink/65 hover:border-moss/40"
                }`}
              >
                <span aria-hidden>{tb.emoji}</span>
                {lang === "en" ? tb.en : tb.zh}
              </button>
            );
          })}
        </div>

        {err === "insufficient" && (
          <p className="mb-3 rounded-card border border-clay/40 bg-clay/12 p-2 text-center text-sm text-clay">
            {t("notEnough", lang)}
          </p>
        )}

        {/* wooden shelf grid */}
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {forSale.map((i) => {
            const owned = save.inventory[i.id] ?? 0;
            const affordable = save.clovers >= i.price;
            const bought = justBought === i.id;
            return (
              <li
                key={i.id}
                className="relative flex flex-col rounded-card border border-line bg-paper-light p-3 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                {/* item art on a shelf plate */}
                <div className="mb-2 flex h-24 items-center justify-center rounded-small bg-paper/80">
                  <ItemIcon itemId={i.id} size={64} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-medium text-ink">{loc(i.name, lang)}</h2>
                    {owned > 0 && (
                      <span className="shrink-0 rounded-full bg-leaf/30 px-1.5 py-0.5 text-[10px] text-moss">
                        ×{owned}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] italic leading-4 text-muted">{loc(i.hint, lang)}</p>

                  {/* tags */}
                  {i.tags.length > 0 && (
                    <ul className="mt-1.5 flex flex-wrap gap-1">
                      {i.tags.map((tg) => (
                        <li
                          key={tg}
                          className="rounded-full border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink/45"
                        >
                          {tg}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => onBuy(i.id)}
                  disabled={!affordable}
                  className={`mt-3 flex items-center justify-center gap-1.5 rounded-card py-2 text-xs font-medium transition-all ${
                    bought
                      ? "bg-leaf text-ink"
                      : "bg-moss text-paper enabled:hover:opacity-90 disabled:opacity-35"
                  }`}
                >
                  {bought ? (
                    <>✓ {lang === "en" ? "Added" : "已放入库存"}</>
                  ) : (
                    <>
                      <ResourceIcon name="clover" size={13} /> {i.price} · {t("buy", lang)}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {forSale.length === 0 && (
          <p className="rounded-card bg-leaf/15 p-6 text-center text-sm text-moss">
            {lang === "en" ? "Nothing in this aisle yet." : "这一格暂时还是空的。"}
          </p>
        )}
      </section>

      {/* ============ Right panel: shopkeeper + inventory ============ */}
      <aside className="flex flex-col gap-4 border-t border-line bg-paper-light px-4 py-4 lg:overflow-y-auto lg:border-l lg:border-t-0">
        {/* shopkeeper */}
        <div className="rounded-card border border-line bg-paper p-3">
          <div className="flex items-center gap-2">
            <Critter species={save.species} size={44} pose="idle" blink={false} />
            <p className="flex-1 rounded-card bg-leaf/15 px-2.5 py-2 text-[11px] leading-4 text-ink/75">
              {lang === "en"
                ? "Pack food first — it decides how far I can go."
                : "先带点食物吧,它决定我能走多远。"}
            </p>
          </div>
        </div>

        {/* wallet */}
        <div>
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <span className="h-3.5 w-1 rounded-full bg-moss" />
            {lang === "en" ? "Wallet" : "我的资源"}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { n: "clover" as const, v: save.clovers, zh: "三叶草", en: "Clovers" },
              { n: "leaf" as const, v: save.leaves, zh: "树叶", en: "Leaves" },
              { n: "stone" as const, v: save.stones, zh: "小石子", en: "Pebbles" },
              { n: "ticket" as const, v: save.tickets, zh: "旅行券", en: "Tickets" },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-2 rounded-card border border-line bg-paper p-2">
                <ResourceIcon name={r.n} size={20} />
                <div>
                  <div className="text-sm font-semibold text-ink">{r.v}</div>
                  <div className="text-[10px] text-muted">{lang === "en" ? r.en : r.zh}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* owned items */}
        <div>
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <span className="h-3.5 w-1 rounded-full bg-moss" />
            {lang === "en" ? "Backpack stock" : "库存"}
          </h2>
          {Object.keys(save.inventory).length === 0 ? (
            <p className="text-xs text-ink/40">{lang === "en" ? "Empty." : "还什么都没有。"}</p>
          ) : (
            <ul className="space-y-1.5">
              {ITEMS.filter((i) => (save.inventory[i.id] ?? 0) > 0).map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-2 rounded-card border border-line bg-paper px-2 py-1.5"
                >
                  <ItemIcon itemId={i.id} size={22} />
                  <span className="flex-1 truncate text-[11px] text-ink">{loc(i.name, lang)}</span>
                  <span className="text-[11px] text-moss">×{save.inventory[i.id]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href="/"
          className="mt-auto rounded-card bg-moss py-2.5 text-center text-sm font-medium text-paper hover:opacity-90"
        >
          🎒 {lang === "en" ? "Go pack" : "去准备行囊"}
        </Link>

        {/* honest note: no real money in v1 */}
        <p className="text-center text-[10px] leading-4 text-muted">
          {lang === "en"
            ? "Everything here is bought with clovers you gather. No real money."
            : "这里的一切都用你收集的三叶草购买,没有任何真实付费。"}
        </p>
      </aside>
    </div>
  );
}
