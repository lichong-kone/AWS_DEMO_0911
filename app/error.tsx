"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Without this, a throw inside any client component
 * blanks the whole page. Kept intentionally cozy and non-alarming.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Froggy Trails error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="paper-card w-full p-8">
        <div className="mb-3 text-5xl" aria-hidden>
          🌧️
        </div>
        <h1 className="mb-1 text-lg font-semibold text-ink">
          小家伙在路上遇到一点雨
        </h1>
        <p className="mb-1 text-sm text-muted">Something went wrong on the way.</p>
        <p className="mb-5 text-xs leading-5 text-ink/50">
          你的存档还在本地,没有丢失。
          <br />
          Your save is still safe on this device.
        </p>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 rounded-card bg-moss py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            再试一次 / Retry
          </button>
          <Link
            href="/"
            className="flex-1 rounded-card border border-line bg-paper py-2.5 text-sm text-ink/75 transition-colors hover:border-moss/40"
          >
            回小屋 / Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-4 font-mono text-[10px] text-ink/30">ref: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
