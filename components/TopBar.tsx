"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame, selectUnreadCount } from "@/lib/store/gameStore";
import { AssetImage } from "./AssetImage";
import { Critter } from "./Critter";
import { t } from "@/lib/i18n";

const TABS = [
  { href: "/", key: "navHome" },
  { href: "/album", key: "navAlbum" },
  { href: "/map", key: "navMap" },
  { href: "/shop", key: "navShop" },
  { href: "/souvenirs", key: "navSouvenirs" },
  { href: "/achievements", key: "navAchievements" },
];

export function TopBar() {
  const pathname = usePathname();
  const save = useGame((s) => s.save);
  const setLang = useGame((s) => s.setLang);
  const lang = save.settings.lang;
  if (!save.createdAt || !save.species) return null;

  const unread = selectUnreadCount(save);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-paper-light/95 backdrop-blur">
      <div className="flex h-11 items-center gap-3 px-4">
        {/* brand */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center">
            <AssetImage
              src="/art/brand/logo-mark.svg"
              alt=""
              className="h-full w-full object-contain"
              fallback={<span aria-hidden>🌿</span>}
            />
          </span>
          <span className="whitespace-nowrap text-lg font-semibold tracking-[0.12em] text-ink">
            {t("appName", lang)}
          </span>
        </Link>

        {/* tabs */}
        <nav className="hidden min-w-0 items-center gap-1 overflow-x-auto sm:flex">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1 text-sm transition-colors ${
                  active
                    ? "bg-leaf/35 font-medium text-moss"
                    : "text-ink/65 hover:bg-moss/10 hover:text-moss"
                }`}
              >
                {t(tab.key, lang)}
              </Link>
            );
          })}
        </nav>

        {/* taped tagline */}
        <div className="mx-auto hidden lg:block">
          <span className="-rotate-1 select-none rounded-sm bg-leaf/25 px-3 py-0.5 text-xs italic text-moss/90 shadow-sm">
            {lang === "en" ? "turn your days into a gentle journey" : "把日子过成一场温柔的旅行"}
          </span>
        </div>

        {/* right cluster */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* language toggle */}
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="rounded-full border border-line px-2 py-1 text-[11px] text-ink/60 transition-colors hover:border-moss/40 hover:text-moss"
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
          >
            {lang === "zh" ? "EN" : "中"}
          </button>

          <Link
            href="/inbox"
            aria-label={t("navInbox", lang)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-moss/10"
          >
            <AssetImage
              src="/art/nav/inbox.svg"
              alt=""
              className="h-5 w-5 object-contain"
              fallback={<span aria-hidden>🔔</span>}
            />
            {unread > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-clay" />
            )}
          </Link>

          <Link
            href="/me"
            className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-2 py-1 hover:border-moss/40"
          >
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-leaf/25">
              <Critter species={save.species} size={24} pose="idle" blink={false} />
            </span>
            <span className="hidden whitespace-nowrap text-xs text-ink/70 md:inline">
              {lang === "en"
                ? `See the world with ${save.frogName}`
                : `和${save.frogName}一起看世界`}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
