"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop || window.scrollY) / max : 0);
      raf = 0;
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-px z-[60] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-signal origin-left transition-transform duration-100"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
