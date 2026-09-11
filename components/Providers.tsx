"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useGame } from "@/lib/store/gameStore";
import { Nav } from "./Nav";
import { TopBar } from "./TopBar";
import { LossNotice } from "./LossNotice";

export function Providers({ children }: { children: React.ReactNode }) {
  const bootstrap = useGame((s) => s.bootstrap);
  const sync = useGame((s) => s.sync);
  const ready = useGame((s) => s.ready);
  const reduceMotion = useGame((s) => s.save.settings.reduceMotion);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const id = setInterval(() => sync(), 5000);
    const onVisible = () => sync();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [sync]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center text-moss">
        <div className="animate-pulse text-lg">🌿 …</div>
      </main>
    );
  }

  // Full-bleed shell: TopBar is a thin full-width strip; each page controls its
  // own padding so Home can bleed edge-to-edge like the concept art.
  //
  // MotionConfig is what actually enforces reduced motion for Framer Motion:
  // CSS `animation: none` cannot stop JS-driven inline transforms (US-10.3).
  // "always" = honour the in-app toggle; "user" = follow the OS preference.
  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex-1">{children}</div>
        <Nav />
        <LossNotice />
      </div>
    </MotionConfig>
  );
}
