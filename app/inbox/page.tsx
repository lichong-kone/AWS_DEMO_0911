"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGame, selectUnreadCount } from "@/lib/store/gameStore";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { PostcardImage } from "@/components/PostcardImage";
import { Decor, StateArt } from "@/components/Decor";
import { weatherIcon } from "@/lib/content/climate";
import { loc, t } from "@/lib/i18n";

export default function InboxPage() {
  const save = useGame((s) => s.save);
  const markMailRead = useGame((s) => s.markMailRead);
  const lang = save.settings.lang;
  const unread = selectUnreadCount(save);
  const since = save.lastReadMailAt ?? 0;

  // opening the mailbox clears the unread marker (after we've captured `since`)
  useEffect(() => {
    markMailRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!save.createdAt) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-sm text-ink/60">
          {lang === "en" ? "Start from home first." : "先从小屋开始游戏吧。"}
        </p>
        <Link href="/" className="rounded-card bg-moss px-4 py-2 text-paper">
          {t("navHome", lang)}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-ink">
            {lang === "en" ? "Mailbox" : "邮箱"}
          </h1>
          <p className="text-sm text-muted">
            {lang === "en"
              ? `letters ${save.frogName} sent along the way`
              : `${save.frogName}一路上寄回来的信`}
          </p>
        </div>
        <Decor name="mailbox" className="block h-14 w-14" />
      </div>

      {save.postcards.length === 0 ? (
        <div className="paper-card p-10 text-center">
          <StateArt name="empty-mail" className="mx-auto mb-3 block h-24 w-24 opacity-85" fallbackEmoji="📪" />
          <p className="text-sm text-ink/55">{t("noMail", lang)}</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-card bg-moss px-4 py-2 text-sm text-paper hover:opacity-90"
          >
            🎒 {lang === "en" ? "Send it off" : "去准备行囊"}
          </Link>
        </div>
      ) : (
        <>
          {unread > 0 && (
            <p className="mb-3 rounded-card bg-clay/12 px-3 py-2 text-center text-xs text-clay">
              {lang === "en" ? `${unread} new letter(s)` : `有 ${unread} 封新来信`}
            </p>
          )}

          <ul className="space-y-2">
            {save.postcards.map((pc) => {
              const dest = DESTINATION_MAP[pc.destinationId];
              const isNew = pc.createdAt > since;
              return (
                <li key={pc.id}>
                  <Link
                    href={`/album/${pc.id}`}
                    className={`relative flex items-start gap-3 rounded-card border p-3 transition-transform hover:-translate-y-0.5 ${
                      isNew ? "border-clay/40 bg-paper-light" : "border-line bg-paper/70"
                    }`}
                  >
                    {/* thumbnail */}
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-rain/15">
                      <PostcardImage destinationId={pc.destinationId} size="thumb" emojiClassName="text-2xl" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {isNew && <span className="h-2 w-2 shrink-0 rounded-full bg-clay" />}
                        <span className={`truncate text-sm ${isNew ? "font-medium text-ink" : "text-ink/80"}`}>
                          {lang === "en" ? "from " : "来自 "}
                          {dest ? `${loc(dest.country, lang)}·${loc(dest.city, lang)}` : pc.destinationId}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
                        <span>{new Date(pc.createdAt).toLocaleString()}</span>
                        <span aria-hidden>{weatherIcon(pc.weather)}</span>
                        {pc.rarity !== "common" && (
                          <span className="rounded-full bg-gold/15 px-1.5 text-[9px] text-gold">
                            {pc.rarity}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] italic leading-4 text-ink/70">
                        “{loc(pc.diary, lang)}”
                      </p>
                    </div>

                    <Decor name="postmark" className="absolute bottom-2 right-2 block h-8 w-8 rotate-12 opacity-50" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
