"use client";

import type { Species } from "@/lib/types";

// Original, hand-drawn-ish SVG critters (no copied assets — NFR-8 / US-10.4).
export function FrogSprite({
  species,
  size = 96,
  blink = true,
}: {
  species: Species;
  size?: number;
  blink?: boolean;
}) {
  const eyeClass = blink ? "origin-center animate-blink" : "";
  const bodyColor = species === "frog" ? "#7Fae54" : species === "otter" ? "#A9825C" : "#8C7A66";
  const bellyColor = species === "frog" ? "#D7E8B0" : species === "otter" ? "#E7D3B3" : "#E9DFD0";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={species}>
      {/* body */}
      <ellipse cx="50" cy="60" rx="30" ry="27" fill={bodyColor} />
      <ellipse cx="50" cy="66" rx="20" ry="18" fill={bellyColor} />
      {/* ears / head bumps vary by species */}
      {species === "frog" && (
        <>
          <circle cx="35" cy="30" r="11" fill={bodyColor} />
          <circle cx="65" cy="30" r="11" fill={bodyColor} />
          <circle cx="35" cy="30" r="5" fill="#fff" />
          <circle cx="65" cy="30" r="5" fill="#fff" />
          <circle cx="35" cy="31" r="2.5" fill="#2D3A2E" className={eyeClass} />
          <circle cx="65" cy="31" r="2.5" fill="#2D3A2E" className={eyeClass} />
        </>
      )}
      {species === "otter" && (
        <>
          <circle cx="38" cy="34" r="7" fill={bodyColor} />
          <circle cx="62" cy="34" r="7" fill={bodyColor} />
          <circle cx="42" cy="44" r="2.6" fill="#2D3A2E" className={eyeClass} />
          <circle cx="58" cy="44" r="2.6" fill="#2D3A2E" className={eyeClass} />
          <ellipse cx="50" cy="52" rx="6" ry="4" fill="#E7D3B3" />
        </>
      )}
      {species === "hedgehog" && (
        <>
          <path d="M20 55 L14 40 L28 48 L26 32 L40 44 L44 28 L54 44 L64 32 L62 48 L76 40 L70 56 Z" fill="#6E5E4E" />
          <circle cx="43" cy="58" r="2.6" fill="#2D3A2E" className={eyeClass} />
          <circle cx="57" cy="58" r="2.6" fill="#2D3A2E" className={eyeClass} />
          <circle cx="50" cy="66" r="3.2" fill="#2D3A2E" />
        </>
      )}
      {/* mouth */}
      <path d="M44 70 Q50 76 56 70" stroke="#2D3A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
