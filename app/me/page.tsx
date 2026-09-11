"use client";

import Link from "next/link";
import { useGame } from "@/lib/store/gameStore";
import { Critter } from "@/components/Critter";
import { t } from "@/lib/i18n";

export default function MePage() {
  const save = useGame((s) => s.save);
  const setLang = useGame((s) => s.setLang);
  const toggleReduceMotion = useGame((s) => s.toggleReduceMotion);
  const lang = save.settings.lang;
  if (!save.createdAt || !save.species) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-4">
      <h1 className="mb-3 text-xl font-semibold text-moss">{t("navMe", lang)}</h1>

      <section className="paper-card mb-3 flex items-center gap-4 p-4">
        <Critter species={save.species} size={80} pose="idle" blink={false} />
        <div>
          <div className="text-lg font-medium text-ink">{save.frogName}</div>
          <div className="text-xs text-ink/50">
            {t("postcards", lang)} {save.postcards.length} · {t("souvenirs", lang)} {save.souvenirs.length}
          </div>
          <div className="text-xs text-ink/50">☘ {save.clovers}</div>
        </div>
      </section>

      {/* hub links */}
      <section className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { href: "/inbox", key: "navInbox", emoji: "📬" },
          { href: "/album", key: "navAlbum", emoji: "📖" },
          { href: "/souvenirs", key: "navSouvenirs", emoji: "🪧" },
          { href: "/achievements", key: "navAchievements", emoji: "🏅" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="paper-card flex flex-col items-center gap-1 py-3 text-xs text-ink/75 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xl" aria-hidden>{l.emoji}</span>
            {t(l.key, lang)}
          </Link>
        ))}
      </section>

      <section className="paper-card mb-3 p-4">
        <h2 className="mb-3 text-sm font-medium text-moss">{t("settings", lang)}</h2>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm">{t("language", lang)}</span>
          <div className="flex overflow-hidden rounded-full border border-ink/20">
            {(["zh", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-sm ${lang === l ? "bg-moss text-paper" : "text-ink/60"}`}
              >
                {l === "zh" ? "中文" : "EN"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">{t("reduceMotion", lang)}</span>
          <button
            onClick={toggleReduceMotion}
            role="switch"
            aria-checked={save.settings.reduceMotion}
            className={`h-6 w-11 rounded-full transition-colors ${save.settings.reduceMotion ? "bg-moss" : "bg-ink/20"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-paper transition-transform ${
                save.settings.reduceMotion ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="paper-card p-4">
        <h2 className="mb-1 text-sm font-medium text-moss">{t("lossNoticeTitle", lang)}</h2>
        <p className="text-xs leading-relaxed text-ink/60">{t("lossNotice", lang)}</p>
      </section>
    </main>
  );
}
