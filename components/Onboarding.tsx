"use client";

import { useState } from "react";
import type { Species } from "@/lib/types";
import { useGame } from "@/lib/store/gameStore";
import { t } from "@/lib/i18n";
import { AssetImage } from "./AssetImage";
import { Critter } from "./Critter";

const SPECIES: { id: Species; key: string }[] = [
  { id: "frog", key: "frog" },
  { id: "otter", key: "otter" },
  { id: "hedgehog", key: "hedgehog" },
];

export function Onboarding() {
  const lang = useGame((s) => s.save.settings.lang);
  const species = useGame((s) => s.save.species);
  const selectSpecies = useGame((s) => s.selectSpecies);
  const nameFrog = useGame((s) => s.nameFrog);
  const setLang = useGame((s) => s.setLang);
  const [name, setName] = useState("");

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <div className="mb-4 flex justify-end">
        <button
          className="text-xs text-ink/50 underline"
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        >
          {lang === "zh" ? "English" : "中文"}
        </button>
      </div>

      <AssetImage
        src="/art/brand/logo-lockup.svg"
        alt={t("appName", lang)}
        className="mx-auto mb-2 h-20 w-auto object-contain"
        fallback={
          <h1 className="mb-1 text-center text-2xl font-bold text-moss">{t("appName", lang)}</h1>
        }
      />
      <p className="mb-6 text-center text-sm text-ink/60">{t("chooseHint", lang)}</p>

      <h2 className="mb-3 text-center text-lg text-ink">{t("chooseCompanion", lang)}</h2>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {SPECIES.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSpecies(s.id)}
            className={`paper-card flex flex-col items-center gap-1 py-4 transition-transform hover:-translate-y-1 ${
              species === s.id ? "ring-2 ring-clay" : ""
            }`}
            aria-pressed={species === s.id}
          >
            <Critter species={s.id} size={72} pose="idle" blink={false} />
            <span className="text-sm">{t(s.key, lang)}</span>
          </button>
        ))}
      </div>

      {species && (
        <div className="paper-card p-5">
          <label className="mb-2 block text-sm text-ink/70" htmlFor="frogName">
            {t("nameIt", lang)}
          </label>
          <input
            id="frogName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder", lang)}
            className="mb-4 w-full rounded-lg border border-ink/20 bg-white/70 px-3 py-2 outline-none focus:border-moss"
            maxLength={12}
          />
          <button
            onClick={() => nameFrog(name)}
            className="w-full rounded-card bg-clay py-2.5 font-medium text-paper transition-opacity hover:opacity-90"
          >
            {t("start", lang)}
          </button>
        </div>
      )}
    </main>
  );
}
