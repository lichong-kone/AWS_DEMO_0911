"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders an <img> from /public if it exists; otherwise renders `fallback`.
 * Lets user-generated art (dropped into public/) auto-apply, while keeping the
 * app working with SVG/emoji fallbacks when a file is missing.
 *
 * `loading="lazy"` is the real win here: album/inbox grids hold ~10 postcards,
 * so eager loading would fetch every thumbnail before the page settles.
 *
 * NOTE: visibility is deliberately NOT gated on a JS `loaded` flag. A cached
 * image can finish loading before React attaches onLoad, so the event never
 * fires and the image would stay hidden — which showed up as blank images when
 * navigating back to a page. Containers carry a background tint instead, which
 * gives a placeholder without ever risking an invisible image.
 */
export function AssetImage({
  src,
  alt,
  className,
  fallback,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  /** set for above-the-fold art (hero images) to skip lazy loading */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  // a new src deserves a fresh chance to load
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
