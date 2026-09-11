"use client";

import { AssetImage } from "./AssetImage";

const SCENE_EMOJI: Record<string, string> = {
  "jp-countryside": "🌾",
  kyoto: "⛩️",
  iceland: "🌌",
  paris: "🗼",
  "swiss-valley": "🏔️",
  "norway-fjord": "⛵",
  "chiang-mai": "🏮",
  "beijing-hutong": "🏯",
  "new-zealand": "🐑",
  morocco: "🏜️",
};

/**
 * Postcard artwork for a destination.
 *
 * `size="thumb"` loads the 480w variant (~90 KB) instead of the 1400w hero
 * (~740 KB) — thumbnails appear in grids, inbox rows and the map sidebar, so
 * this is the difference between a snappy list and a multi-megabyte page.
 *
 * Resolution order: optimised jpg → user-dropped png → emoji placeholder,
 * so the app still works if art is missing or replaced.
 */
export function PostcardImage({
  destinationId,
  alt = "",
  size = "full",
  className = "h-full w-full object-cover",
  emojiClassName = "text-4xl",
}: {
  destinationId: string;
  alt?: string;
  size?: "full" | "thumb";
  className?: string;
  emojiClassName?: string;
}) {
  const suffix = size === "thumb" ? "-thumb" : "";
  const emoji = SCENE_EMOJI[destinationId] ?? "🖼️";
  // hero art is the focal point of its page — don't defer it
  const eager = size === "full";

  return (
    <AssetImage
      src={`/postcards/${destinationId}${suffix}.jpg`}
      alt={alt}
      className={className}
      eager={eager}
      fallback={
        <AssetImage
          src={`/postcards/${destinationId}.png`}
          alt={alt}
          className={className}
          eager={eager}
          fallback={
            <span className={`flex h-full w-full items-center justify-center ${emojiClassName}`} aria-hidden>
              {emoji}
            </span>
          }
        />
      }
    />
  );
}
