"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { SOUVENIR_NAME } from "@/lib/content/souvenirLookup";
import { Decor, StateArt } from "@/components/Decor";
import { PostcardImage } from "@/components/PostcardImage";
import { SouvenirIcon } from "@/components/ItemIcon";
import { loc, t } from "@/lib/i18n";

const RARITY_RING: Record<string, string> = {
  common: "",
  gilded: "ring-2 ring-gold/50",
  starpaper: "ring-2 ring-[#6A6AA0]/40",
  seasonal: "ring-2 ring-clay/40",
};

export default function AlbumPage() {
  const save = useGame((s) => s.save);
  const markMailRead = useGame((s) => s.markMailRead);
  const lang = save.settings.lang;

  // browsing the album clears the unread mail marker
  useEffect(() => {
    markMailRead();
  }, [markMailRead]);

  if (!save.createdAt) return null;

  return (
    <div
      className="min-h-[calc(100vh-2.75rem)] px-4 py-5"
      style={{
        background: "radial-gradient(circle at 50% 0%, #7A5A40 0%, #6B4E38 50%, #5A4130 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* header on a paper strip */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-page bg-paper-light/92 px-4 py-3 shadow-soft">
          <div>
            <h1 className="text-xl font-semibold text-ink">{t("navAlbum", lang)}</h1>
            <p className="text-xs text-muted">
              {lang === "en" ? "turn the pages of the journey" : "把旅行的温柔,收藏起来"}
            </p>
          </div>
          <div className="flex gap-4 text-center text-xs text-muted">
            <div>
              <div className="text-base font-semibold text-ink">{save.postcards.length}</div>
              {t("postcards", lang)}
            </div>
            <div>
              <div className="text-base font-semibold text-ink">{save.souvenirs.length}</div>
              {t("souvenirs", lang)}
            </div>
          </div>
        </div>

        {save.postcards.length === 0 ? (
          <div className="rounded-page bg-paper-light/92 p-10 text-center">
            <StateArt name="empty-album" className="mx-auto mb-3 block h-24 w-24 opacity-85" fallbackEmoji="📖" />
            <p className="text-sm text-ink/55">{t("albumEmpty", lang)}</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {save.postcards.map((pc, i) => {
              const dest = DESTINATION_MAP[pc.destinationId];
              const souvenirs = save.souvenirs
                .filter((s) => s.destinationId === pc.destinationId)
                .slice(0, 2);
              return (
                <li key={pc.id}>
                  <Link
                    href={`/album/${pc.id}`}
                    className="block bg-[#FBF4E4] p-3 pb-4 shadow-lg transition-transform hover:-translate-y-1"
                    style={{ transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)` }}
                  >
                    {/* taped photo */}
                    <div className="relative">
                      <Decor name="tape" className="absolute -left-3 -top-2 z-10 block h-6 w-14 -rotate-12" />
                      <Decor name="tape" className="absolute -right-3 -top-2 z-10 block h-6 w-14 rotate-12" />
                      <div
                        className={`aspect-[4/3] w-full overflow-hidden bg-rain/15 ${RARITY_RING[pc.rarity] ?? ""}`}
                      >
                        <PostcardImage destinationId={pc.destinationId} size="thumb" emojiClassName="text-4xl" />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h2 className="text-sm font-medium text-ink">
                        {dest ? `${loc(dest.country, lang)}·${loc(dest.city, lang)}` : pc.destinationId}
                      </h2>
                      <p className="text-[10px] text-muted">
                        {new Date(pc.createdAt).toLocaleDateString()}
                        {pc.rarity !== "common" && ` · ${pc.rarity}`}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] italic leading-4 text-ink/70">
                        “{loc(pc.diary, lang)}”
                      </p>

                      {souvenirs.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1">
                          {souvenirs.map((s, k) => (
                            <li
                              key={k}
                              className="flex items-center gap-1 rounded-full border border-line px-1.5 py-0.5 text-[10px] text-ink/65"
                            >
                              <SouvenirIcon souvenirId={s.souvenirId} size={13} />
                              {SOUVENIR_NAME(s.souvenirId, lang)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
