"use client";

import { useEffect, useState } from "react";
import type { Lang, Trip } from "@/lib/types";
import { deriveStatus } from "@/lib/engine/tripEngine";
import { StateArt } from "./Decor";
import { t } from "@/lib/i18n";

/** Ticks once per second so the countdown feels alive. */
function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatRemaining(ms: number, lang: Lang): string {
  if (ms <= 0) return lang === "en" ? "almost home" : "就快到了";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (d > 0) return lang === "en" ? `${d}d ${h}h` : `${d} 天 ${h} 小时`;
  if (h > 0) return lang === "en" ? `${h}h ${m}m` : `${h} 小时 ${m} 分`;
  if (m > 0) return lang === "en" ? `${m}m ${sec}s` : `${m} 分 ${sec} 秒`;
  return lang === "en" ? `${sec}s` : `${sec} 秒`;
}

/**
 * Trip countdown + progress. Deliberately shows time-to-milestone only —
 * never the destination, so the surprise is preserved (FR-4.3 / US-3.2).
 */
export function TripProgress({ trip, lang }: { trip: Trip; lang: Lang }) {
  const now = useNow();
  const status = deriveStatus(trip, now);

  const outbound = status === "TRAVELING";
  const target = outbound ? trip.arriveAt : trip.returnAt;
  const start = outbound ? trip.departAt : trip.arriveAt;

  const total = Math.max(1, target - start);
  const done = Math.min(Math.max(now - start, 0), total);
  const pct = Math.round((done / total) * 100);
  const remaining = target - now;

  return (
    <div className="rounded-card border border-line bg-paper/80 p-3">
      <div className="flex items-center gap-2">
        <StateArt name="traveling" className="block h-10 w-10 shrink-0" fallbackEmoji="🧭" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium text-moss">
              {outbound
                ? lang === "en"
                  ? "on the way there"
                  : "正在去某个地方"
                : lang === "en"
                  ? "on the way home"
                  : "在回家的路上"}
            </span>
            <span className="shrink-0 text-[11px] tabular-nums text-ink/70">
              {formatRemaining(remaining, lang)}
            </span>
          </div>

          <div
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={outbound ? "trip outbound progress" : "trip return progress"}
          >
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                outbound ? "bg-moss" : "bg-clay"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-2 text-[11px] italic leading-4 text-ink/55">
        {outbound ? t("comeBackLater", lang) : t("arrivingSoon", lang)}
      </p>
    </div>
  );
}
