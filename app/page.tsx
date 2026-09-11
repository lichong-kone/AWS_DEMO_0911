"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, selectFrogState, selectUnreadCount } from "@/lib/store/gameStore";
import { Onboarding } from "@/components/Onboarding";
import { Backpack } from "@/components/Backpack";
import { Critter, poseForState } from "@/components/Critter";
import { AssetImage } from "@/components/AssetImage";
import { Decor, StateArt } from "@/components/Decor";
import { PostcardImage } from "@/components/PostcardImage";
import { ResourceTiles } from "@/components/ResourceTiles";
import { TripProgress } from "@/components/TripProgress";
import { TripSummaryModal } from "@/components/TripSummaryModal";
import { PostcardReveal } from "@/components/PostcardReveal";
import { DESTINATION_MAP, DESTINATIONS } from "@/lib/content/destinations";
import { loc, t } from "@/lib/i18n";
import type { Postcard } from "@/lib/types";

export default function HomePage() {
  const save = useGame((s) => s.save);
  const harvest = useGame((s) => s.harvest);
  const markMailRead = useGame((s) => s.markMailRead);
  const tripSummary = useGame((s) => s.tripSummary);
  const clearTripSummary = useGame((s) => s.clearTripSummary);
  const lang = save.settings.lang;
  const [showPack, setShowPack] = useState(false);
  const [reveal, setReveal] = useState<Postcard | null>(null);

  // opening the reveal counts as reading the mail
  const closeReveal = () => {
    setReveal(null);
    markMailRead();
  };

  // The trip summary now covers the "you got mail" moment, so the auto-reveal
  // only fires for postcards that arrive without a summary (e.g. legacy saves).
  const prevCount = useRef(save.postcards.length);
  useEffect(() => {
    if (save.postcards.length > prevCount.current && !tripSummary) {
      setReveal(save.postcards[0]);
    }
    prevCount.current = save.postcards.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save.postcards]);

  if (!save.createdAt || !save.species) return <Onboarding />;

  const state = selectFrogState(save);
  const unread = selectUnreadCount(save);
  const traveling = state === "TRAVELING" || state === "RETURNING";
  const stateLabel =
    state === "TRAVELING" ? t("traveling", lang) : state === "RETURNING" ? t("returning", lang) : t("atHome", lang);
  const recent = save.postcards[0];
  const recentDest = recent ? DESTINATION_MAP[recent.destinationId] : undefined;
  const discovered = Object.keys(save.visits).length;
  // never departed yet → show the onboarding nudge
  const isFirstTime = !save.currentTrip && save.tickets === 0 && save.postcards.length === 0;

  const bubble = traveling
    ? lang === "en"
      ? "I'll write when I get somewhere!"
      : "到了地方就给你写信！"
    : lang === "en"
      ? "Lovely weather — where shall we go?"
      : "今天天气真好！要去哪里呢？";

  return (
    <>
      {/* Full-bleed two-column: scene bleeds left/top, panel flush right, no gap */}
      <div className="grid lg:h-[calc(100vh-2.75rem)] lg:grid-cols-[1fr_384px]">
        {/* ================= Scene (edge to edge) ================= */}
        <section className="relative min-h-[52vh] overflow-hidden lg:min-h-0">
          <AssetImage
            src="/scenes/home-day.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            fallback={
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg,#CFE6EC 0%,#DAE9E3 40%,#C3D89B 41%,#A7C66B 100%)",
                }}
              >
                {/* sea + distant hills */}
                <svg viewBox="0 0 400 220" className="absolute inset-x-0 top-[12%] w-full" preserveAspectRatio="none">
                  <path d="M0 96 C60 52 112 78 162 54 C212 30 252 74 302 50 C342 30 380 64 400 54 L400 130 L0 130 Z" fill="#8FAE86" opacity="0.9" />
                  <path d="M0 122 C70 84 130 108 190 84 C250 60 300 100 360 80 L400 86 L400 150 L0 150 Z" fill="#7C9A72" opacity="0.75" />
                  <rect y="130" width="400" height="34" fill="#9DC4CC" opacity="0.85" />
                </svg>
                {/* cottage */}
                <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2">
                  <svg width="190" height="150" viewBox="0 0 190 150">
                    <path d="M14 66 L95 16 L176 66 Z" fill="#8B5E3C" />
                    <rect x="32" y="66" width="126" height="70" rx="5" fill="#E8D9BC" />
                    <rect x="82" y="88" width="30" height="48" rx="14" fill="#5B7F3B" />
                    <rect x="46" y="80" width="24" height="22" rx="3" fill="#9DC0CC" />
                    <rect x="124" y="80" width="22" height="20" rx="3" fill="#9DC0CC" />
                  </svg>
                </div>
                {/* foliage frame + drifting clouds */}
                <Decor name="leaf-corner" className="absolute -left-2 -top-2 block h-24 w-24 opacity-80 animate-sway" />
                <Decor name="cloud" className="absolute right-6 top-3 block h-14 w-24 opacity-90 animate-drift" />
                <Decor name="cloud" className="absolute right-40 top-10 block h-10 w-16 opacity-70 animate-drift" />
              </div>
            }
          />

          {/* wooden signpost */}
          <div className="absolute left-4 top-6 w-[92px] -rotate-2 rounded-md border border-wood/40 bg-[#C9A87C]/92 p-2 text-center shadow-soft">
            <p className="text-[11px] leading-5 text-wood">
              {lang === "en" ? (
                <>a tiny courtyard<br />can still grow<br />a faraway world</>
              ) : (
                <>小小的庭院<br />也能种出<br />大大的远方</>
              )}
            </p>
            <p className="mt-1 text-[9px] text-wood/70">— {save.frogName}</p>
          </div>

          {/* hanging sign: 出发 / 回来 */}
          <div className="absolute right-6 top-4 w-[74px] rotate-1 rounded-md border border-wood/40 bg-[#D8BE95]/92 p-1.5 text-center shadow-soft">
            <p className="text-[11px] font-medium leading-4 text-wood">
              {lang === "en" ? <>go far<br />come home</> : <>出发<br />回来 ♡</>}
            </p>
          </div>

          {/* chalkboard */}
          <div className="absolute bottom-6 right-6 w-[96px] rotate-1 rounded-md border-2 border-wood/60 bg-[#3C4A3A] p-2 text-center shadow-soft">
            <p className="text-[11px] leading-4 text-paper/90">
              {lang === "en" ? <>the wind brings<br />good news</> : <>风会带来<br />好消息</>}
            </p>
          </div>

          {/* character + mailbox anchored bottom-center */}
          <div className="relative flex h-full min-h-[52vh] flex-col items-center justify-end gap-1 pb-8 lg:min-h-0">
            {traveling && (
              <p className="mb-1 rounded-full bg-paper/85 px-3 py-1 text-xs italic text-ink/70 shadow-sm">
                {state === "TRAVELING" ? t("comeBackLater", lang) : t("arrivingSoon", lang)}
              </p>
            )}
            <div className="flex items-end gap-3">
              <AssetImage
                src="/art/decor/mailbox.svg"
                alt=""
                className="h-20 w-20 object-contain"
                fallback={<span className="text-4xl" aria-hidden>📮</span>}
              />
              <motion.div
                animate={traveling ? { opacity: 0.4 } : { y: [0, -4, 0] }}
                transition={{ repeat: traveling ? 0 : Infinity, duration: 3.2 }}
              >
                <Critter
                  species={save.species}
                  size={150}
                  pose={poseForState(state, {
                    hasNewMail: unread > 0,
                    hour: new Date().getHours(),
                  })}
                  blink={!traveling}
                />
              </motion.div>
            </div>

            {save.courtyardPending > 0 && (
              <button
                onClick={harvest}
                className="mt-2 rounded-full border border-moss/50 bg-paper/92 px-3 py-1 text-xs text-moss shadow-sm transition-colors hover:bg-moss/10"
              >
                🌱 {t("harvest", lang)} · {save.courtyardPending}
              </button>
            )}
          </div>
        </section>

        {/* ================= Right panel (flush) ================= */}
        <aside className="flex flex-col gap-3 border-l border-line bg-paper-light px-4 py-4 lg:overflow-y-auto">
          {/* profile */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-leaf/25 ring-2 ring-moss/35">
                <Critter species={save.species} size={58} pose="idle" blink={false} />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold text-ink">{save.frogName}</h1>
                <p className="truncate text-xs text-muted">
                  {lang === "en" ? "a little one who loves wind and distance" : "一只喜欢风和远方的小青蛙"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <span className="shrink-0 rounded-full bg-leaf/35 px-3 py-1.5 text-xs font-medium text-moss">
                🏠 {stateLabel}
              </span>
              <span className="rounded-card border border-line bg-paper px-2.5 py-1.5 text-[11px] leading-4 text-ink/75">
                {bubble}
              </span>
            </div>
          </div>

          {/* live countdown while away */}
          {save.currentTrip && <TripProgress trip={save.currentTrip} lang={lang} />}

          {/* first-trip nudge (FR-1.4) — only before the very first departure */}
          {isFirstTime && (
            <div className="rounded-card border border-clay/35 bg-clay/8 p-3">
              <p className="text-xs font-medium text-clay">
                {lang === "en" ? "It looks ready to head out." : "它好像准备出去看看。"}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-ink/70">
                {lang === "en"
                  ? "Put the bread in the food slot, add the bottle, then send it off. The first trip is short — it'll be back in a minute or two."
                  : "把面包放进食物格,再带上水壶,就可以让它出发了。第一趟很短,一两分钟就会回来。"}
              </p>
            </div>
          )}

          <ResourceTiles lang={lang} />

          <div className="flex gap-2">
            <button
              disabled={traveling}
              onClick={() => setShowPack(true)}
              className="flex-1 rounded-card bg-moss py-3 text-sm font-medium text-paper shadow-soft transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
            >
              🎒 {traveling ? t("travelingNow", lang) : t("prepareBackpack", lang)}
            </button>
            <Link
              href="/shop"
              className="flex items-center gap-1 rounded-card border border-line bg-paper px-3 py-3 text-sm text-ink/75 transition-colors hover:border-moss/40"
            >
              🛒 {lang === "en" ? "Shop" : "去商店"}
            </Link>
          </div>

          <div className="h-px bg-line" />

          {/* recent mail */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-medium text-ink">
                {t("recentMail", lang)}
                {unread > 0 && (
                  <span className="rounded-full bg-clay px-1.5 py-0.5 text-[10px] leading-none text-paper">
                    {unread}
                  </span>
                )}
              </h2>
              <Link href="/album" className="text-xs text-muted hover:text-moss">
                {lang === "en" ? "more →" : "查看更多 →"}
              </Link>
            </div>

            {recent ? (
              <button className="w-full text-left" onClick={() => setReveal(recent)}>
                <div className="relative flex gap-2 rounded-card border border-line bg-paper p-2">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-rain/15">
                    <PostcardImage destinationId={recent.destinationId} size="thumb" emojiClassName="text-2xl" />
                  </div>
                  <div className="min-w-0 flex-1 pr-6">
                    <p className="truncate text-xs text-ink">
                      {lang === "en" ? "from " : "来自 "}
                      {recentDest ? `${loc(recentDest.country, lang)}·${loc(recentDest.city, lang)}` : ""}
                    </p>
                    <p className="text-[10px] text-muted">{new Date(recent.createdAt).toLocaleDateString()}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] italic leading-4 text-ink/70">
                      {loc(recent.diary, lang)}
                    </p>
                  </div>
                  <span className="absolute bottom-1 right-1 flex h-9 w-9 rotate-12 items-center justify-center opacity-60">
                    <AssetImage
                      src="/art/decor/postmark.svg"
                      alt=""
                      className="h-full w-full object-contain"
                      fallback={<span className="text-xs" aria-hidden>✉</span>}
                    />
                  </span>
                </div>
              </button>
            ) : (
              <div className="py-2 text-center">
                <StateArt name="empty-mail" className="mx-auto mb-1 block h-16 w-16 opacity-80" fallbackEmoji="📪" />
                <p className="text-xs text-ink/45">{t("noMail", lang)}</p>
              </div>
            )}
          </div>

          {/* stats */}
          <div className="mt-auto grid grid-cols-3 divide-x divide-line border-t border-line pt-3 text-center">
            <div>
              <div className="text-sm font-semibold text-ink">
                {discovered}/{DESTINATIONS.length}
              </div>
              <div className="text-[10px] text-muted">{lang === "en" ? "discovered" : "已发现"}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{save.postcards.length}</div>
              <div className="text-[10px] text-muted">{t("postcards", lang)}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{save.souvenirs.length}</div>
              <div className="text-[10px] text-muted">{t("souvenirs", lang)}</div>
            </div>
          </div>
        </aside>
      </div>

      {showPack && <Backpack onClose={() => setShowPack(false)} />}

      {/* journey wrap-up */}
      {tripSummary && (
        <TripSummaryModal summary={tripSummary} lang={lang} onClose={clearTripSummary} />
      )}

      <AnimatePresence>
        {reveal && <PostcardReveal postcard={reveal} lang={lang} onClose={closeReveal} />}
      </AnimatePresence>
    </>
  );
}
