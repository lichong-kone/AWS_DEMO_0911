"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Lang } from "@/lib/types";
import type { TripSummary } from "@/lib/store/gameStore";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { SOUVENIR_NAME } from "@/lib/content/souvenirLookup";
import { PostcardImage } from "./PostcardImage";
import { Decor } from "./Decor";
import { SouvenirIcon, ResourceIcon } from "./ItemIcon";
import { useModalDismiss } from "@/lib/hooks/useModalDismiss";
import { loc, t } from "@/lib/i18n";

function durationText(ms: number, lang: Lang): string {
  const m = Math.round(ms / 60000);
  if (m < 60) return lang === "en" ? `${m} min` : `${m} 分钟`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h < 24) return lang === "en" ? `${h}h ${rest}m` : `${h} 小时 ${rest} 分`;
  const d = Math.floor(h / 24);
  return lang === "en" ? `${d}d ${h % 24}h` : `${d} 天 ${h % 24} 小时`;
}

/** One-shot wrap-up shown when a journey completes. */
export function TripSummaryModal({
  summary,
  lang,
  onClose,
}: {
  summary: TripSummary;
  lang: Lang;
  onClose: () => void;
}) {
  useModalDismiss(onClose);
  const dest = DESTINATION_MAP[summary.destinationId];
  const firstCard = summary.postcardIds[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
      onClick={onClose}
    >
      <motion.div
        className="paper-card relative w-full max-w-md overflow-hidden"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* hero */}
        <div className="relative aspect-[16/8] w-full bg-rain/15">
          <PostcardImage destinationId={summary.destinationId} size="full" emojiClassName="text-5xl" />
          {summary.isNewPlace && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-clay px-2.5 py-1 text-[11px] font-medium text-paper shadow-soft">
              <Decor name="sparkle" className="block h-3 w-3" />
              {lang === "en" ? "New place!" : "新发现的地方!"}
            </span>
          )}
          <Decor name="postmark" className="absolute bottom-2 right-2 block h-12 w-12 rotate-12 opacity-60" />
        </div>

        <div className="p-5">
          <p className="text-xs text-muted">
            {lang === "en" ? "came home from" : "刚从这里回来"}
          </p>
          <h2 className="text-xl font-semibold leading-tight text-ink">
            {dest ? `${loc(dest.country, lang)}·${loc(dest.city, lang)}` : summary.destinationId}
          </h2>
          {dest && <p className="mt-1 text-xs leading-5 text-ink/60">{loc(dest.blurb, lang)}</p>}

          {/* stat row */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-paper/70 py-2 text-center">
            <div>
              <div className="text-base font-semibold text-ink">{summary.postcardIds.length}</div>
              <div className="text-[10px] text-muted">{t("postcards", lang)}</div>
            </div>
            <div>
              <div className="text-base font-semibold text-ink">{summary.souvenirIds.length}</div>
              <div className="text-[10px] text-muted">{t("souvenirs", lang)}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-base font-semibold text-ink">
                <ResourceIcon name="ticket" size={14} />1
              </div>
              <div className="text-[10px] text-muted">{lang === "en" ? "Ticket" : "旅行券"}</div>
            </div>
          </div>

          {/* souvenirs gained */}
          {summary.souvenirIds.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {summary.souvenirIds.map((id, i) => (
                <li
                  key={`${id}-${i}`}
                  className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-paper px-2 py-1 text-[11px] text-ink/80"
                >
                  <SouvenirIcon souvenirId={id} size={16} />
                  {SOUVENIR_NAME(id, lang)}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-[11px] text-muted">
            {lang === "en" ? "away for " : "在外面待了 "}
            {durationText(summary.returnAt - summary.departAt, lang)}
            {summary.visitCount > 1 &&
              (lang === "en"
                ? ` · visit #${summary.visitCount}`
                : ` · 第 ${summary.visitCount} 次到访`)}
          </p>

          {/* actions */}
          <div className="mt-5 flex gap-2">
            {firstCard && (
              <Link
                href={`/album/${firstCard}`}
                onClick={onClose}
                className="flex-1 rounded-card bg-moss py-2.5 text-center text-sm font-medium text-paper hover:opacity-90"
              >
                📖 {lang === "en" ? "Read the letter" : "看看来信"}
              </Link>
            )}
            <button
              onClick={onClose}
              className="rounded-card border border-line bg-paper px-4 py-2.5 text-sm text-ink/75 transition-colors hover:border-moss/40"
            >
              {t("close", lang)}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
