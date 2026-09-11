"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/lib/store/gameStore";
import { AssetImage } from "./AssetImage";
import { t } from "@/lib/i18n";

const LINKS = [
  { href: "/", key: "navHome", icon: "🏡", art: "home" },
  { href: "/map", key: "navMap", icon: "🗺️", art: "map" },
  { href: "/album", key: "navAlbum", icon: "📖", art: "album" },
  { href: "/shop", key: "navShop", icon: "🛍️", art: "shop" },
  { href: "/achievements", key: "navAchievements", icon: "🏅", art: "achievement" },
  { href: "/me", key: "navMe", icon: "🌱", art: "profile" },
];

export function Nav() {
  const pathname = usePathname();
  const lang = useGame((s) => s.save.settings.lang);
  const started = useGame((s) => !!s.save.createdAt);
  if (!started) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur sm:hidden">
      <ul className="mx-auto flex max-w-5xl items-stretch justify-around">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href} className="flex-1">
              <Link
                href={l.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                  active ? "text-clay" : "text-ink/60 hover:text-moss"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  <AssetImage
                    src={`/art/nav/${l.art}.svg`}
                    alt=""
                    className="h-full w-full object-contain"
                    fallback={<span className="text-xl" aria-hidden>{l.icon}</span>}
                  />
                </span>
                <span>{t(l.key, lang)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
