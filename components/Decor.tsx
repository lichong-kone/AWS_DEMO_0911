"use client";

import { AssetImage } from "./AssetImage";

type DecorName =
  | "cloud"
  | "compass"
  | "leaf-corner"
  | "mailbox"
  | "paper-corner"
  | "postmark"
  | "pressed-flower"
  | "route-dash"
  | "signpost"
  | "sparkle"
  | "tape";

const FALLBACK: Record<DecorName, string> = {
  cloud: "☁️",
  compass: "🧭",
  "leaf-corner": "🌿",
  mailbox: "📮",
  "paper-corner": "📄",
  postmark: "✉",
  "pressed-flower": "🌼",
  "route-dash": "···",
  signpost: "🪧",
  sparkle: "✨",
  tape: "",
};

/** Decorative art from public/art/decor/. Purely visual, hidden from a11y tree. */
export function Decor({
  name,
  className,
}: {
  name: DecorName;
  className?: string;
}) {
  return (
    <span className={className} aria-hidden>
      <AssetImage
        src={`/art/decor/${name}.svg`}
        alt=""
        className="h-full w-full object-contain"
        fallback={<span>{FALLBACK[name]}</span>}
      />
    </span>
  );
}

type StateName = "empty-album" | "empty-mail" | "locked-destination" | "traveling";

/**
 * Empty/status illustrations. Uses the text-stripped `-notext` variants so the
 * caption can be localized in HTML (the originals have Chinese baked in).
 */
export function StateArt({
  name,
  className,
  fallbackEmoji = "🌿",
}: {
  name: StateName;
  className?: string;
  fallbackEmoji?: string;
}) {
  // "traveling" ships without embedded text, so it needs no -notext variant
  const file = name === "traveling" ? name : `${name}-notext`;
  return (
    <span className={className} aria-hidden>
      <AssetImage
        src={`/art/states/${file}.svg`}
        alt=""
        className="h-full w-full object-contain"
        fallback={<span className="text-4xl">{fallbackEmoji}</span>}
      />
    </span>
  );
}
