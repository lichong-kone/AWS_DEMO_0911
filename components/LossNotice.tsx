"use client";

import { useGame } from "@/lib/store/gameStore";
import { useModalDismiss } from "@/lib/hooks/useModalDismiss";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

// Inner component so the modal hook is only mounted while the dialog is open
// (hooks can't be called conditionally).
function Dialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  useModalDismiss(onClose);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loss-notice-title"
    >
      <div className="paper-card max-w-sm p-6">
        <h2 id="loss-notice-title" className="mb-2 text-lg font-semibold text-moss">
          {t("lossNoticeTitle", lang)}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-ink/80">{t("lossNotice", lang)}</p>
        <button
          onClick={onClose}
          autoFocus
          className="w-full rounded-card bg-moss py-2 text-paper transition-opacity hover:opacity-90"
        >
          {t("gotIt", lang)}
        </button>
      </div>
    </div>
  );
}

/** Honest v1 boundary: progress is local-only (US-10.2 / FR-11.4). */
export function LossNotice() {
  const started = useGame((s) => !!s.save.createdAt);
  const seen = useGame((s) => s.save.seenLossNotice);
  const lang = useGame((s) => s.save.settings.lang);
  const dismiss = useGame((s) => s.dismissLossNotice);

  if (!started || seen) return null;
  return <Dialog lang={lang} onClose={dismiss} />;
}
