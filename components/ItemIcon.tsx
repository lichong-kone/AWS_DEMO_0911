"use client";

import { AssetImage } from "./AssetImage";

/** Item icon from design-v3 (public/art/items/<id>.svg). */
export function ItemIcon({ itemId, size = 28 }: { itemId: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center">
      <AssetImage
        src={`/art/items/${itemId}.svg`}
        alt=""
        className="h-full w-full object-contain"
        fallback={<span aria-hidden>🎒</span>}
      />
    </span>
  );
}

/** Souvenir icon (public/art/souvenirs/<id>.svg). */
export function SouvenirIcon({ souvenirId, size = 28 }: { souvenirId: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center">
      <AssetImage
        src={`/art/souvenirs/${souvenirId}.svg`}
        alt=""
        className="h-full w-full object-contain"
        fallback={<span aria-hidden>🪧</span>}
      />
    </span>
  );
}

/** Resource icon: clover / leaf / stone / ticket. */
export function ResourceIcon({ name, size = 18 }: { name: "clover" | "leaf" | "stone" | "ticket"; size?: number }) {
  const emoji = name === "clover" ? "☘" : name === "leaf" ? "🍃" : name === "stone" ? "🪨" : "🎫";
  return (
    <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center">
      <AssetImage
        src={`/art/resources/${name}.svg`}
        alt=""
        className="h-full w-full object-contain"
        fallback={<span aria-hidden>{emoji}</span>}
      />
    </span>
  );
}
