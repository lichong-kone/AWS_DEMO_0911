"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGame } from "@/lib/store/gameStore";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { SOUVENIR_NAME } from "@/lib/content/souvenirLookup";
import { tempRange, weatherIcon, climateLabel } from "@/lib/content/climate";
import { AssetImage } from "@/components/AssetImage";
import { Decor } from "@/components/Decor";
import { PostcardImage } from "@/components/PostcardImage";
import { SouvenirIcon } from "@/components/ItemIcon";
import { ShareButton } from "@/components/ShareButton";
import { loc, t } from "@/lib/i18n";

export default function PostcardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const save = useGame((s) => s.save);
  const lang = save.settings.lang;

  const idx = save.postcards.findIndex((p) => p.id === params.id);
  const pc = idx >= 0 ? save.postcards[idx] : undefined;

  if (!save.createdAt || !pc) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-sm text-ink/60">
          {lang === "en" ? "Postcard not found." : "找不到这张明信片。"}
        </p>
        <Link href="/album" className="rounded-card bg-moss px-4 py-2 text-paper">
          {t("navAlbum", lang)}
        </Link>
      </main>
    );
  }

  const dest = DESTINATION_MAP[pc.destinationId];
  const souvenirs = save.souvenirs.filter((s) => s.destinationId === pc.destinationId).slice(0, 2);
  const prev = save.postcards[idx - 1];
  const next = save.postcards[idx + 1];

  const dateLine =
    pc.tripDepartAt && pc.tripReturnAt
      ? `${new Date(pc.tripDepartAt).toLocaleDateString()} – ${new Date(pc.tripReturnAt).toLocaleDateString()}`
      : new Date(pc.createdAt).toLocaleDateString();

  return (
    // wooden desk backdrop, full bleed
    <div
      className="relative min-h-[calc(100vh-2.75rem)] px-4 py-4"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #7A5A40 0%, #6B4E38 45%, #5A4130 100%)",
      }}
    >
      {/* corner foliage */}
      <span className="pointer-events-none absolute left-1 top-1 text-4xl opacity-70 animate-sway" aria-hidden>🌿</span>
      <span className="pointer-events-none absolute bottom-2 left-2 text-3xl opacity-60" aria-hidden>🌼</span>

      {/* breadcrumb */}
      <Link
        href="/album"
        className="relative z-10 mb-3 inline-flex items-center gap-1 rounded-full bg-paper/85 px-3 py-1 text-xs text-ink/75 hover:bg-paper"
      >
        ← {lang === "en" ? "Back to album" : "返回旅行册"}
      </Link>

      <div className="relative mx-auto flex max-w-5xl items-start gap-3">
        {/* ============ Book spread ============ */}
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-2xl">
          {/* center gutter */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/20 to-black/10 md:block" />

          <div className="grid md:grid-cols-2">
            {/* ---------- Left page: photo ---------- */}
            <div className="relative bg-[#F1E7D2] p-6">
              {/* taped polaroid */}
              <div className="relative mx-auto max-w-[300px] rotate-[-1deg] bg-white p-3 pb-10 shadow-lg">
                {/* tape strips */}
                <Decor name="tape" className="absolute -left-4 -top-3 z-10 block h-8 w-20 -rotate-12" />
                <Decor name="tape" className="absolute -right-4 -top-3 z-10 block h-8 w-20 rotate-12" />
                <Decor name="tape" className="absolute -bottom-3 left-1/2 z-10 block h-8 w-20 -translate-x-1/2 rotate-2" />

                <div className="aspect-[4/3] w-full overflow-hidden bg-rain/20">
                  <PostcardImage
                    destinationId={pc.destinationId}
                    alt={dest ? loc(dest.city, lang) : ""}
                    size="full"
                    emojiClassName="text-5xl"
                  />
                </div>
              </div>

              {/* handwritten caption + pressed flower */}
              <div className="mt-6 flex items-end gap-2">
                <Decor name="pressed-flower" className="block h-12 w-12 shrink-0 opacity-90" />
                <p className="flex-1 -rotate-1 text-sm italic leading-6 text-ink/80">
                  {loc(pc.diary, lang)}
                </p>
              </div>

              {/* page corner */}
              <Decor name="leaf-corner" className="pointer-events-none absolute bottom-0 left-0 block h-16 w-16 opacity-70" />
            </div>

            {/* ---------- Right page: details ---------- */}
            <div className="relative bg-[#FBF4E4] p-6">
              {/* postmark + stamp */}
              <div className="absolute right-5 top-5 flex items-start gap-2">
                <span className="flex h-16 w-16 rotate-[-8deg] items-center justify-center opacity-70">
                  <AssetImage
                    src="/art/decor/postmark.svg"
                    alt=""
                    className="h-full w-full object-contain"
                    fallback={
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-clay/60 text-[8px] leading-tight text-clay/80">
                        GREAT<br />MEMORIES
                      </span>
                    }
                  />
                </span>
                {/* perforated stamp */}
                <span className="flex h-16 w-14 items-center justify-center border-[3px] border-dotted border-line bg-paper p-1">
                  <span className="flex h-full w-full items-center justify-center bg-rain/15 text-xl" aria-hidden>
                    ⛪
                  </span>
                </span>
              </div>

              <h1 className="pr-32 text-2xl font-semibold leading-tight text-ink">
                {dest ? `${loc(dest.country, lang)}·${loc(dest.city, lang)}` : pc.destinationId}
              </h1>
              <p className="mt-0.5 border-b border-line pb-1 text-sm italic text-muted">
                {dest ? dest.city.en : ""}
              </p>

              {/* meta rows */}
              <dl className="mt-4 space-y-1.5 text-xs text-ink/75">
                <div className="flex items-center gap-2">
                  <span aria-hidden>📅</span>
                  <span>{dateLine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>📍</span>
                  <span>
                    {dest ? loc(dest.city, lang) : ""} {dest && `(${dest.city.en})`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>{weatherIcon(pc.weather)}</span>
                  <span>
                    {t(`weather_${pc.weather}`, lang)}
                    {dest && ` · ${tempRange(dest.climate)}`}
                  </span>
                </div>
              </dl>

              {/* diary */}
              <section className="mt-4 rounded-card bg-leaf/12 p-3">
                <h2 className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-clay">
                  <span aria-hidden>🍃</span>
                  {lang === "en" ? `${save.frogName}'s diary` : `${save.frogName}的日记`}
                </h2>
                <p className="text-xs leading-6 text-ink/80">{loc(pc.diary, lang)}</p>
                {dest && <p className="mt-1 text-[11px] leading-5 text-ink/55">{loc(dest.blurb, lang)}</p>}
              </section>

              {/* souvenirs */}
              {souvenirs.length > 0 && (
                <section className="mt-4">
                  <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
                    <span aria-hidden>🎁</span>
                    {lang === "en" ? "Souvenirs from this trip" : "本次获得的纪念品"}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {souvenirs.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-card border border-line bg-paper p-2">
                        <SouvenirIcon souvenirId={s.souvenirId} size={30} />
                        <div className="min-w-0">
                          <div className="truncate text-[11px] text-ink">
                            {SOUVENIR_NAME(s.souvenirId, lang)}
                          </div>
                          <div className="text-[9px] text-muted">
                            {new Date(s.obtainedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* actions */}
              <div className="mt-5 flex gap-2">
                <Link
                  href="/album"
                  className="flex flex-1 items-center justify-center gap-1 rounded-card bg-moss py-2.5 text-xs font-medium text-paper hover:opacity-90"
                >
                  📖 {lang === "en" ? "Keep in album" : "保存到旅行册"}
                </Link>
                <span className="flex items-center">
                  <ShareButton postcard={pc} lang={lang} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Page turn buttons ============ */}
        <div className="hidden shrink-0 flex-col gap-2 lg:flex">
          <button
            disabled={!prev}
            onClick={() => prev && router.push(`/album/${prev.id}`)}
            className="w-16 rounded-md border border-wood/50 bg-[#C9A87C]/90 py-3 text-[11px] text-wood shadow-soft transition-opacity enabled:hover:opacity-90 disabled:opacity-30"
          >
            ↑<br />{lang === "en" ? "prev" : "上一页"}
          </button>
          <button
            disabled={!next}
            onClick={() => next && router.push(`/album/${next.id}`)}
            className="w-16 rounded-md border border-wood/50 bg-[#C9A87C]/90 py-3 text-[11px] text-wood shadow-soft transition-opacity enabled:hover:opacity-90 disabled:opacity-30"
          >
            ↓<br />{lang === "en" ? "next" : "下一页"}
          </button>
        </div>
      </div>

      {/* handwritten corner */}
      <p className="pointer-events-none absolute bottom-4 right-5 text-right text-[11px] italic leading-4 text-paper/45">
        Some<br />where<br />Better
      </p>
    </div>
  );
}
