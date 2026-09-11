"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { DESTINATIONS, DESTINATION_MAP } from "@/lib/content/destinations";
import { SOUVENIR_NAME } from "@/lib/content/souvenirLookup";
import { SouvenirIcon } from "@/components/ItemIcon";
import { Decor } from "@/components/Decor";
import { loc, t } from "@/lib/i18n";

export default function SouvenirsPage() {
  const save = useGame((s) => s.save);
  const lang = save.settings.lang;
  const [onlyOwned, setOnlyOwned] = useState(false);

  // souvenirId -> count owned
  const owned = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of save.souvenirs) m.set(s.souvenirId, (m.get(s.souvenirId) ?? 0) + 1);
    return m;
  }, [save.souvenirs]);

  const totalPool = DESTINATIONS.reduce((n, d) => n + d.souvenirPool.length, 0);
  const uniqueOwned = owned.size;

  if (!save.createdAt) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-sm text-ink/60">
          {lang === "en" ? "Start from home first." : "先从小屋开始游戏吧。"}
        </p>
        <Link href="/" className="rounded-card bg-moss px-4 py-2 text-paper">
          {t("navHome", lang)}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-ink">
            {lang === "en" ? "Curio shelf" : "纪念品柜"}
          </h1>
          <p className="text-sm text-muted">
            {lang === "en"
              ? "small things, kept for no reason at all"
              : "一些没什么用,却舍不得丢的小东西"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-ink">
              <span className="text-xl font-semibold">{uniqueOwned}</span>
              <span className="text-muted"> / {totalPool}</span>
            </div>
            <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-moss transition-all"
                style={{ width: `${Math.round((uniqueOwned / totalPool) * 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setOnlyOwned((v) => !v)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              onlyOwned ? "border-moss bg-moss text-paper" : "border-line text-ink/65 hover:border-moss/40"
            }`}
          >
            {lang === "en" ? "Owned only" : "只看已有"}
          </button>
        </div>
      </div>

      {/* one wooden shelf per destination */}
      <div className="space-y-4">
        {DESTINATIONS.map((d) => {
          const visited = !!save.visits[d.id];
          const pool = d.souvenirPool;
          const got = pool.filter((s) => owned.has(s.id)).length;
          const shown = onlyOwned ? pool.filter((s) => owned.has(s.id)) : pool;
          if (onlyOwned && shown.length === 0) return null;

          return (
            <section key={d.id}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  <span className="h-3.5 w-1 rounded-full bg-moss" />
                  {visited ? (
                    <Link href={`/map/${d.id}`} className="hover:text-moss">
                      {loc(d.country, lang)}·{loc(d.city, lang)}
                    </Link>
                  ) : (
                    <span className="text-ink/40">???</span>
                  )}
                </h2>
                <span className="text-xs text-muted">
                  {got} / {pool.length}
                </span>
              </div>

              {/* shelf */}
              <div className="relative rounded-card border border-line bg-paper-light p-3">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {shown.map((s) => {
                    const count = owned.get(s.id) ?? 0;
                    const has = count > 0;
                    return (
                      <li
                        key={s.id}
                        className={`flex items-center gap-2 rounded-small border p-2 ${
                          has ? "border-gold/45 bg-paper" : "border-line bg-paper/50"
                        }`}
                        title={has ? SOUVENIR_NAME(s.id, lang) : "???"}
                      >
                        <span className={has ? "" : "opacity-25 grayscale"}>
                          <SouvenirIcon souvenirId={s.id} size={30} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-[11px] ${has ? "text-ink" : "text-ink/40"}`}>
                            {has ? SOUVENIR_NAME(s.id, lang) : "???"}
                          </div>
                          {count > 1 && <div className="text-[10px] text-moss">×{count}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* wooden shelf edge */}
                <div className="mt-2 h-1.5 rounded-full bg-wood/25" />
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] italic text-muted">
        <Decor name="pressed-flower" className="block h-8 w-8 opacity-70" />
        {lang === "en"
          ? "a plain pebble can hold a whole afternoon"
          : "一块普通的石头,也能装下一个下午"}
      </div>
    </main>
  );
}
