"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  className?: string;
};

export function StatCounter({
  to,
  duration = 1400,
  prefix = "",
  suffix = "",
  label,
  className = "",
}: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <div ref={ref} className={className}>
      <div className="font-serif text-5xl md:text-6xl tracking-tight text-bone">
        {prefix}
        {val.toLocaleString()}
        {suffix}
      </div>
      {label && (
        <div className="mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-fog">
          {label}
        </div>
      )}
    </div>
  );
}
