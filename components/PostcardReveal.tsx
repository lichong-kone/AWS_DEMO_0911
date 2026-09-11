"use client";

import { motion } from "framer-motion";
import type { Lang, Postcard } from "@/lib/types";
import { PostcardCard } from "./PostcardCard";
import { useModalDismiss } from "@/lib/hooks/useModalDismiss";
import { t } from "@/lib/i18n";

/**
 * A single postcard sliding onto the desk (US-5.1 — deliberately not a toast).
 * Extracted from the home page so it can own the modal dismiss behaviour.
 */
export function PostcardReveal({
  postcard,
  lang,
  onClose,
}: {
  postcard: Postcard;
  lang: Lang;
  onClose: () => void;
}) {
  useModalDismiss(onClose);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 120, rotate: -3, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-center text-sm text-paper">{t("newPostcard", lang)}</div>
        <PostcardCard postcard={postcard} lang={lang} />
        <button
          onClick={onClose}
          autoFocus
          className="mt-3 w-full rounded-card bg-paper py-2 text-sm text-ink transition-opacity hover:opacity-90"
        >
          {t("close", lang)}
        </button>
      </motion.div>
    </motion.div>
  );
}
