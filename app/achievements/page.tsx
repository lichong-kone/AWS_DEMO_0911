"use client";

import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { evaluateAchievements, achievementText } from "@/lib/content/achievements";
import { AssetImage } from "@/components/AssetImage";
import { Decor } from "@/components/Decor";
import { t } from "@/lib/i18n";

export default function AchievementsPage() {
  const save = useGame((s) => s.save);
  const lang = save.settings.lang;

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

  const list = evaluateAchievements(save);
  const got = list.filter((a) => a.unlocked).length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-ink">
            {lang === "en" ? "Keepsakes" : "旅行纪念章"}
          </h1>
          <p className="text-sm text-muted">
            {lang === "en"
              ? "small marks of a long, gentle journey"
              : "一路慢慢走,留下的小小印记"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-ink">
            <span className="text-xl font-semibold">{got}</span>
            <span className="text-muted"> / {list.length}</span>
          </div>
          <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-moss transition-all"
              style={{ width: `${Math.round((got / list.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => {
          const pct = Math.round((a.progress / a.goal) * 100);
          return (
            <li
              key={a.id}
              className={`flex gap-3 rounded-card border p-3 transition-colors ${
                a.unlocked
                  ? "border-gold/50 bg-paper-light shadow-soft"
                  : "border-line bg-paper/60"
              }`}
            >
              {/* badge */}
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center ${
                  a.unlocked ? "" : "opacity-25 grayscale"
                }`}
              >
                <AssetImage
                  src={`/art/badges/${a.id}.svg`}
                  alt=""
                  className="h-full w-full object-contain"
                  fallback={
                    <span className="text-3xl" aria-hidden>
                      {a.unlocked ? "🏅" : "⚪"}
                    </span>
                  }
                />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className={`text-sm font-medium ${a.unlocked ? "text-ink" : "text-ink/50"}`}>
                    {achievementText(a.name, lang)}
                  </h2>
                  {a.unlocked && <Decor name="sparkle" className="block h-4 w-4 shrink-0" />}
                </div>
                <p className="mt-0.5 text-[11px] leading-4 text-muted">
                  {achievementText(a.desc, lang)}
                </p>

                {/* progress (only when it has meaningful steps) */}
                {a.goal > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full transition-all ${
                          a.unlocked ? "bg-gold" : "bg-moss"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted">
                      {a.progress}/{a.goal}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-[11px] italic text-muted">
        {lang === "en"
          ? "nothing here expires — come back whenever you like"
          : "这里什么都不会过期,想起来了再回来看看"}
      </p>
    </main>
  );
}
