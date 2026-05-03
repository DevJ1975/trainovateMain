"use client";

import { useEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";

export function SiteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let cancelled = false;
    (async () => {
      const Lenis = (await import("@studio-freight/lenis")).default;
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      let raf = 0;
      function frame(time: number) {
        lenis.raf(time);
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      cleanup = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
