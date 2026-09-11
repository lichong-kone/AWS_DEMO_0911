"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGame } from "@/lib/store/gameStore";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { DEST_CATEGORIES, CATEGORY_EMOJI, categoryName } from "@/lib/content/categories";
import { SOUVENIR_NAME } from "@/lib/content/souvenirLookup";
import { tempRange, climateLabel } from "@/lib/content/climate";
import { AssetImage } from "@/components/AssetImage";
import { Decor, StateArt } from "@/components/Decor";
import { PostcardImage } from "@/components/PostcardImage";
import { SouvenirIcon } from "@/components/ItemIcon";
import { loc, t } from "@/lib/i18n";

const STATUS_LABEL: Record<string, { zh: string; en: string }> = {
  visited: { zh: "去过", en: "Visited" },
  frequent: { zh: "多次到访", en: "Frequent" },
  collected: { zh: "完成收藏", en: "Collected" },
};

export default function DestinationDetailPage() {
  const params = useParams<{ id: string }>();
  const save = useGame((s) => s.save);
  const lang = save.settings.lang;

  const dest = DESTINATION_MAP[params.id];

  if (!save.createdAt || !dest) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-sm text-ink/60">
          {lang === "en" ? "Place not found." : "找不到这个地点。"}
        </p>
        <Link href="/map" className="rounded-card bg-moss px-4 py-2 text-paper">
          {t("navMap", lang)}
        </Link>
      </main>
    );
  }

  const visit = save.visits[dest.id];
  const discovered = !!visit;

  // postcards & souvenirs collected from this place
  const cards = save.postcards.filter((p) => p.destinationId === dest.id);
  const souvenirsGot = new Set(
    save.souvenirs.filter((s) => s.destinationId === dest.id).map((s) => s.souvenirId),
  );
  const cats = DEST_CATEGORIES[dest.id] ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-4">
      <Link
        href="/map"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-moss"
      >
        ← {lang === "en" ? "Back to map" : "返回地图"}
      </Link>

      {/* hero */}
      <div className="paper-card relative mb-4 overflow-hidden">
        <div className="relative aspect-[16/7] w-full bg-rain/15">
          {discovered ? (
            <PostcardImage
              destinationId={dest.id}
              alt={loc(dest.city, lang)}
              size="full"
              emojiClassName="text-5xl"
            />
          ) : (
            // undiscovered: fog overlay, no reveal
            <div className="relative flex h-full w-full items-center justify-center">
              <AssetImage
                src="/art/map/fog.svg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-70"
                fallback={<div className="absolute inset-0 bg-ink/10" />}
              />
              <StateArt
                name="locked-destination"
                className="relative block h-24 w-24 opacity-80"
                fallbackEmoji="🌫️"
              />
            </div>
          )}
          <Decor name="paper-corner" className="pointer-events-none absolute right-0 top-0 block h-14 w-14 opacity-70" />
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl font-semibold leading-tight text-ink">
                {discovered ? `${loc(dest.country, lang)}·${loc(dest.city, lang)}` : "???"}
              </h1>
              {discovered && <p className="text-sm italic text-muted">{dest.city.en}</p>}
            </div>
            {discovered && visit && (
              <span className="rounded-full bg-leaf/30 px-3 py-1 text-xs text-moss">
                {(STATUS_LABEL[visit.status] &&
                  (lang === "en" ? STATUS_LABEL[visit.status].en : STATUS_LABEL[visit.status].zh)) ??
                  visit.status}{" "}
                · ×{visit.count}
              </span>
            )}
          </div>

          {discovered ? (
            <p className="mt-2 text-sm leading-6 text-ink/75">{loc(dest.blurb, lang)}</p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-ink/50">
              {lang === "en"
                ? "Somewhere out there. Pack the right things and your companion may find it."
                : "还没去过的地方。带上合适的东西,小家伙也许会走到那里。"}
            </p>
          )}

          {/* facts */}
          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/70">
            <div className="flex items-center gap-1.5">
              <span aria-hidden>🌡️</span>
              {discovered ? `${climateLabel(dest.climate, lang)} · ${tempRange(dest.climate)}` : "—"}
            </div>
            <div className="flex items-center gap-1.5">
              <span aria-hidden>🧭</span>
              {discovered
                ? `${dest.lat.toFixed(1)}°, ${dest.lng.toFixed(1)}°`
                : lang === "en"
                  ? "unknown"
                  : "未知"}
            </div>
            <div className="flex items-center gap-1.5">
              <span aria-hidden>✨</span>
              {dest.rarity}
            </div>
          </dl>

          {/* categories */}
          {cats.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-ink/65"
                >
                  <span aria-hidden>{CATEGORY_EMOJI[c]}</span>
                  {categoryName(c, lang)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* postcards from here */}
      <section className="mb-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
          <span className="h-3.5 w-1 rounded-full bg-moss" />
          {t("postcards", lang)}
          <span className="text-xs text-muted">({cards.length})</span>
        </h2>
        {cards.length === 0 ? (
          <p className="rounded-card bg-leaf/12 p-3 text-center text-xs text-muted">
            {lang === "en" ? "No postcards from here yet." : "还没有从这里寄回来的明信片。"}
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/album/${p.id}`}
                  className="flex gap-2 rounded-card border border-line bg-paper-light p-2 transition-transform hover:-translate-y-0.5"
                >
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded bg-rain/15">
                    <PostcardImage destinationId={p.destinationId} size="thumb" emojiClassName="text-base" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted">
                      {new Date(p.createdAt).toLocaleDateString()}
                      {p.rarity !== "common" && ` · ${p.rarity}`}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] italic leading-4 text-ink/70">
                      {loc(p.diary, lang)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* souvenir checklist — shows what's still out there */}
      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
          <span className="h-3.5 w-1 rounded-full bg-moss" />
          {t("souvenirs", lang)}
          <span className="text-xs text-muted">
            ({souvenirsGot.size}/{dest.souvenirPool.length})
          </span>
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {dest.souvenirPool.map((s) => {
            const got = souvenirsGot.has(s.id);
            return (
              <li
                key={s.id}
                className={`flex items-center gap-2 rounded-card border p-2 ${
                  got ? "border-gold/45 bg-paper-light" : "border-line bg-paper/50"
                }`}
              >
                <span className={got ? "" : "opacity-25 grayscale"}>
                  <SouvenirIcon souvenirId={s.id} size={26} />
                </span>
                <span className={`truncate text-[11px] ${got ? "text-ink" : "text-ink/40"}`}>
                  {got ? SOUVENIR_NAME(s.id, lang) : "???"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
