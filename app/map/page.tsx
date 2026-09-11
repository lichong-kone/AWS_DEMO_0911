"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { DESTINATIONS, DESTINATION_MAP } from "@/lib/content/destinations";
import {
  ALL_CATEGORIES,
  CATEGORY_EMOJI,
  categoryName,
  categoryProgress,
  categoryTotals,
} from "@/lib/content/categories";
import { WorldMap } from "@/components/WorldMap";
import { AssetImage } from "@/components/AssetImage";
import { StateArt } from "@/components/Decor";
import { PostcardImage } from "@/components/PostcardImage";
import { loc, t } from "@/lib/i18n";

type RailTab = "world" | "footprints" | "collection" | "stats";

export default function MapPage() {
  const save = useGame((s) => s.save);
  const lang = save.settings.lang;
  const [tab, setTab] = useState<RailTab>("world");

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

  const discovered = Object.keys(save.visits).length;
  const pct = Math.round((discovered / DESTINATIONS.length) * 100);
  const totals = categoryTotals();
  const progress = categoryProgress(save.visits);
  const recent = save.postcards[0];
  const recentDest = recent ? DESTINATION_MAP[recent.destinationId] : undefined;

  const routePoints = DESTINATIONS.filter((d) => save.visits[d.id]).map((d) => ({
    x: d.lng + 180,
    y: 90 - d.lat,
  }));

  const RAIL: { id: RailTab; art: string; emoji: string; zh: string; en: string }[] = [
    { id: "world", art: "map", emoji: "🌍", zh: "世界地图", en: "World" },
    { id: "footprints", art: "album", emoji: "📍", zh: "旅行足迹", en: "Trails" },
    { id: "collection", art: "achievement", emoji: "⭐", zh: "我的收藏", en: "Collected" },
    { id: "stats", art: "profile", emoji: "📊", zh: "旅行统计", en: "Stats" },
  ];

  const visitedList = DESTINATIONS.filter((d) => save.visits[d.id]);

  return (
    <div className="grid lg:h-[calc(100vh-2.75rem)] lg:grid-cols-[84px_1fr_300px]">
      {/* ============ Left icon rail ============ */}
      <nav className="flex gap-2 overflow-x-auto border-b border-line bg-paper-light px-2 py-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:py-3">
        {RAIL.map((r) => {
          const active = tab === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setTab(r.id)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-card px-2 py-2 text-[10px] transition-colors ${
                active ? "bg-leaf/35 text-moss" : "text-muted hover:bg-moss/10"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <AssetImage
                  src={`/art/nav/${r.art}.svg`}
                  alt=""
                  className="h-full w-full object-contain"
                  fallback={<span aria-hidden>{r.emoji}</span>}
                />
              </span>
              <span className="whitespace-nowrap leading-none">{lang === "en" ? r.en : r.zh}</span>
            </button>
          );
        })}
      </nav>

      {/* ============ Center: map / tab content ============ */}
      <section className="relative min-h-[60vh] overflow-hidden bg-rain/10 lg:min-h-0">
        {tab === "world" && (
          <>
            {/* base layer: user watercolor art → real Natural Earth map → hand-drawn */}
            <AssetImage
              src="/map/world.png"
              alt="world map"
              className="absolute inset-0 h-full w-full object-fill"
              fallback={
                <AssetImage
                  src="/map/land-110m.svg"
                  alt="world map"
                  className="absolute inset-0 h-full w-full object-fill"
                  fallback={<WorldMap className="absolute inset-0 h-full w-full" />}
                />
              }
            />

            {/* dotted route overlay */}
            {routePoints.length >= 2 && (
              <svg
                viewBox="0 0 360 180"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                <polyline
                  points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#C96F4A"
                  strokeWidth="0.9"
                  strokeDasharray="2 2"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* overlaid title (like the concept) */}
            <div className="pointer-events-none absolute left-6 top-5">
              <h1 className="text-2xl font-semibold leading-tight text-ink/85 drop-shadow-sm">
                {lang === "en" ? "The world is wide" : "世界这么大"}
              </h1>
              <p className="mt-0.5 text-lg text-ink/70">
                {lang === "en" ? `${save.frogName} will go look` : `${save.frogName}会去看看`}
              </p>
              <p className="mt-1 -rotate-2 text-[11px] italic text-moss/70">
                Collect moments,
                <br />
                Not things.
              </p>
            </div>

            {/* pins with name chips — clickable through to the place page */}
            {DESTINATIONS.map((d) => {
              const v = save.visits[d.id];
              const x = ((d.lng + 180) / 360) * 100;
              const y = ((90 - d.lat) / 180) * 100;
              // "new" = discovered but only ever visited once
              const isNew = !!v && v.count === 1;
              return (
                <Link
                  key={d.id}
                  href={`/map/${d.id}`}
                  className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center transition-transform hover:scale-110"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={v ? `${loc(d.city, lang)}, ${loc(d.country, lang)}` : "???"}
                  aria-label={v ? `${loc(d.city, lang)}, ${loc(d.country, lang)}` : "undiscovered place"}
                >
                  {v ? (
                    <>
                      <span className="whitespace-nowrap rounded-full border border-line bg-paper-light/95 px-2 py-0.5 text-[10px] font-medium text-ink shadow-sm">
                        {loc(d.city, lang)}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center drop-shadow">
                        <AssetImage
                          src={`/art/map/${isNew ? "pin-new" : "pin-visited"}.svg`}
                          alt=""
                          className="h-full w-full object-contain"
                          fallback={<span aria-hidden>📍</span>}
                        />
                      </span>
                    </>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center opacity-70">
                      <AssetImage
                        src="/art/map/pin-locked.svg"
                        alt=""
                        className="h-full w-full object-contain"
                        fallback={<span className="text-xs" aria-hidden>🌫️</span>}
                      />
                    </span>
                  )}
                </Link>
              );
            })}

            {/* compass */}
            <span className="absolute bottom-4 left-5 flex h-10 w-10 items-center justify-center opacity-85">
              <AssetImage
                src="/art/decor/compass.svg"
                alt=""
                className="h-full w-full object-contain"
                fallback={<span className="text-2xl" aria-hidden>🧭</span>}
              />
            </span>

            {/* legend + affordance hint */}
            <div className="pointer-events-none absolute bottom-3 right-4 flex flex-col items-end gap-0.5 rounded-card bg-paper-light/85 px-2.5 py-1.5 text-[10px] text-ink/65">
              <span>📍 {lang === "en" ? "Visited" : "去过"}</span>
              <span>✨ {lang === "en" ? "New" : "新发现"}</span>
              <span>🌫️ {lang === "en" ? "Undiscovered" : "未发现"}</span>
              <span className="mt-0.5 italic text-muted">
                {lang === "en" ? "tap a pin →" : "点图钉看详情 →"}
              </span>
            </div>

            {/* bottom caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
              <p className="text-sm text-ink/60">{lang === "en" ? "to be continued" : "未完待续"}</p>
              <p className="text-[11px] text-ink/45">
                {lang === "en"
                  ? `so many places still waiting for ${save.frogName}…`
                  : `还有很多地方,等着${save.frogName}去发现…`}
              </p>
            </div>
          </>
        )}

        {tab === "footprints" && (
          <div className="h-full overflow-y-auto p-4">
            <h2 className="mb-3 text-lg font-semibold text-ink">
              {lang === "en" ? "Trails" : "旅行足迹"}
            </h2>
            {visitedList.length === 0 ? (
              <p className="rounded-card bg-leaf/15 p-4 text-center text-sm text-moss">
                {lang === "en" ? "No trails yet." : "还没有足迹,送它出发吧。"}
              </p>
            ) : (
              <ol className="space-y-2">
                {visitedList.map((d, i) => (
                  <li key={d.id}>
                    <Link
                      href={`/map/${d.id}`}
                      className="paper-card flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf/30 text-xs text-moss">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-ink">
                          {loc(d.city, lang)}, {loc(d.country, lang)}
                        </div>
                        <div className="truncate text-xs text-muted">{loc(d.blurb, lang)}</div>
                      </div>
                      <span className="ml-auto shrink-0 text-xs text-moss">×{save.visits[d.id].count}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === "collection" && (
          <div className="h-full overflow-y-auto p-4">
            <h2 className="mb-3 text-lg font-semibold text-ink">
              {lang === "en" ? "Collected places" : "我的收藏"}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {DESTINATIONS.map((d) => {
                const v = save.visits[d.id];
                return (
                  <li key={d.id}>
                    <Link
                      href={`/map/${d.id}`}
                      className="paper-card flex items-center justify-between p-3 transition-transform hover:-translate-y-0.5"
                    >
                      <div className="min-w-0">
                        <div className={`flex items-center gap-1.5 text-sm ${v ? "text-ink" : "text-ink/35"}`}>
                          {!v && (
                            <StateArt name="locked-destination" className="block h-5 w-5 shrink-0 opacity-60" fallbackEmoji="🌫️" />
                          )}
                          {v ? `${loc(d.city, lang)}, ${loc(d.country, lang)}` : "???"}
                        </div>
                        {v && <div className="truncate text-xs text-muted">{loc(d.blurb, lang)}</div>}
                      </div>
                      <span className="ml-2 shrink-0 text-xs text-moss">
                        {v ? `×${v.count} · ${v.status}` : "→"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {tab === "stats" && (
          <div className="h-full overflow-y-auto p-4">
            <h2 className="mb-3 text-lg font-semibold text-ink">
              {lang === "en" ? "Travel stats" : "旅行统计"}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: lang === "en" ? "Discovered" : "已发现", v: `${discovered}/${DESTINATIONS.length}` },
                { label: t("postcards", lang), v: save.postcards.length },
                { label: t("souvenirs", lang), v: save.souvenirs.length },
                { label: lang === "en" ? "Tickets" : "旅行券", v: save.tickets },
              ].map((s) => (
                <div key={s.label} className="paper-card p-3 text-center">
                  <div className="text-xl font-semibold text-ink">{s.v}</div>
                  <div className="text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ Right panel ============ */}
      <aside className="flex flex-col gap-4 border-t border-line bg-paper-light px-4 py-4 lg:overflow-y-auto lg:border-l lg:border-t-0">
        {/* discovered */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>🌍</span>
            <span className="text-sm text-ink">{t("discovered", lang)}</span>
            <span className="text-2xl font-semibold text-ink">{discovered}</span>
            <span className="text-sm text-muted">/ {DESTINATIONS.length}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted">
            {lang === "en" ? `places ${save.frogName} has been` : `${save.frogName}已去过的地方`}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-muted">{pct}%</span>
          </div>
        </div>

        {/* recent trip */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <span className="h-3.5 w-1 rounded-full bg-moss" />
              {lang === "en" ? "Recent trip" : "最近旅行"}
            </h2>
            <Link href="/album" className="text-xs text-muted hover:text-moss">
              {lang === "en" ? "more →" : "查看更多 →"}
            </Link>
          </div>
          {recent && recentDest ? (
            <Link href="/album" className="flex gap-2 rounded-card border border-line bg-paper p-2">
              <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-rain/15">
                <PostcardImage destinationId={recent.destinationId} size="thumb" emojiClassName="text-xl" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-ink">
                  {loc(recentDest.country, lang)}·{loc(recentDest.city, lang)}
                </p>
                <p className="text-[10px] text-muted">
                  {new Date(recent.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] italic leading-3.5 text-ink/65">
                  {loc(recent.diary, lang)}
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-xs text-ink/40">{t("noMail", lang)}</p>
          )}
        </div>

        {/* collection progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <span className="h-3.5 w-1 rounded-full bg-moss" />
              {lang === "en" ? "Collection" : "收藏进度"}
            </h2>
            <span className="text-xs text-muted">
              {discovered} / {DESTINATIONS.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_CATEGORIES.map((c) => (
              <div key={c} className="flex items-center gap-2 rounded-card border border-line bg-paper p-2">
                <span className="text-lg" aria-hidden>{CATEGORY_EMOJI[c]}</span>
                <div className="min-w-0">
                  <div className="text-xs text-ink">{categoryName(c, lang)}</div>
                  <div className="text-[11px] text-muted">
                    {progress[c]}/{totals[c]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* handwritten footer */}
        <p className="mt-auto -rotate-1 text-center text-[11px] italic leading-4 text-muted">
          {lang === "en" ? (
            <>every place holds<br />a footprint of growing up</>
          ) : (
            <>每一个地方<br />都记满成长的足迹</>
          )}
        </p>
      </aside>
    </div>
  );
}
