"use client";

import type { Postcard } from "@/lib/types";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { loc, t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PostcardImage } from "./PostcardImage";

const SCENE_EMOJI: Record<string, string> = {
  field: "🌾", roadside: "🛤️", sunset: "🌇", shrine: "⛩️", alley: "🏮",
  rain: "🌧️", aurora: "🌌", coast: "🌊", snow: "❄️", river: "🏞️",
  cafe: "☕", roof: "🏙️", meadow: "🌼", peak: "🏔️", cabin: "🛖",
  fjord: "⛰️", boat: "⛵", cliff: "🧗", market: "🏮", temple: "🛕",
  courtyard: "🏯", lake: "🏕️", dune: "🏜️", stars: "✨",
};

const RARITY_STYLE: Record<string, string> = {
  common: "bg-[#FBF6EA] border-ink/15",
  gilded: "bg-[#FBF3DD] border-[#C9A24A] ring-1 ring-[#C9A24A]/40",
  starpaper: "bg-[#EAE7F5] border-[#6A6AA0] ring-1 ring-[#6A6AA0]/40",
  seasonal: "bg-[#EFE6D8] border-clay/50 ring-1 ring-clay/30",
};

export function PostcardCard({ postcard, lang }: { postcard: Postcard; lang: Lang }) {
  const dest = DESTINATION_MAP[postcard.destinationId];
  const place = dest ? `${loc(dest.city, lang)}, ${loc(dest.country, lang)}` : postcard.destinationId;
  const weatherLabel = t(`weather_${postcard.weather}`, lang);

  return (
    <div className={`rounded-card border p-4 shadow-soft ${RARITY_STYLE[postcard.rarity] ?? RARITY_STYLE.common}`}>
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span>{place}</span>
        <span className="rounded-full border border-ink/20 px-2 py-0.5">✉ {weatherLabel}</span>
      </div>
      <div className="my-3 h-28 overflow-hidden rounded-lg bg-white/50">
        <PostcardImage destinationId={postcard.destinationId} alt={place} size="full" emojiClassName="text-5xl" />
      </div>
      <p className="text-sm italic leading-relaxed text-ink/85">“{loc(postcard.diary, lang)}”</p>
      <div className="mt-2 text-right text-[10px] text-ink/45">
        {new Date(postcard.createdAt).toLocaleDateString()}
        {postcard.rarity !== "common" && <span className="ml-1">· {postcard.rarity}</span>}
      </div>
    </div>
  );
}
