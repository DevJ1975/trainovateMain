"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Download } from "lucide-react";

export function Hero() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = 14827;
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center tnv-section">
      <div className="tnv-container">
        <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Eyebrow index="TRAINOVATE" label="SDVOSB" />
        </div>

        <h1
          className="tnv-h1 mt-8 max-w-[1100px] text-balance animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          We engineer the doctrine of{" "}
          <span className="tnv-italic text-signal">modern safety.</span>
        </h1>

        <p
          className="tnv-body mt-10 max-w-2xl text-pretty animate-fade-up"
          style={{ animationDelay: "420ms" }}
        >
          AI-powered learning, EHS instrumentation, and immersive content for
          the industries the world depends on.
        </p>

        <div
          className="mt-12 flex flex-wrap items-center gap-3 animate-fade-up"
          style={{ animationDelay: "560ms" }}
        >
          <Link href="/contact" className="tnv-btn-signal">
            Request a demo
          </Link>
          <a href="/pdf/capability-statement.pdf" className="tnv-btn-ghost">
            <Download size={14} />
            Capabilities (PDF)
          </a>
        </div>
      </div>

      <div className="absolute left-6 md:left-10 lg:left-16 bottom-10 z-10 animate-fade-up" style={{ animationDelay: "900ms" }}>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
          Incidents prevented (sim)
        </div>
        <div className="font-mono text-2xl text-signal mt-1 tabular-nums">
          {count.toLocaleString()}
        </div>
      </div>

      <div className="absolute right-6 md:right-10 lg:right-16 bottom-10 z-10 hidden md:block">
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog text-right">
          Scroll
        </div>
        <div className="mt-2 w-px h-12 bg-gradient-to-b from-signal to-transparent ml-auto" />
      </div>
    </section>
  );
}
