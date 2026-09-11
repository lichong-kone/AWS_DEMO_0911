"use client";

import { useEffect, useRef } from "react";

/**
 * Shared modal behaviour: Escape to close, background scroll lock, and focus
 * restored to whatever was focused before the modal opened.
 *
 * Without this, dialogs could only be dismissed by clicking the overlay, which
 * left keyboard users stuck (NFR-5).
 */
export function useModalDismiss(onClose: () => void) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);
}
