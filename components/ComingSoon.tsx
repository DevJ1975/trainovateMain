"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Intro = dynamic(() => import("./Intro").then((m) => ({ default: m.Intro })), {
  ssr: false,
});

export function ComingSoon() {
  // Each completed cycle bumps `cycle`, remounting <Intro> for a fresh loop.
  const [cycle, setCycle] = useState(0);

  return (
    <main className="fixed inset-0 bg-ink text-bone">
      <Intro key={cycle} onDone={() => setCycle((n) => n + 1)} />

      <div className="absolute inset-x-0 top-10 flex justify-center pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/60">
          Trainovate.ai
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center pointer-events-none">
        <div
          className="font-mono uppercase tracking-[0.4em] text-bone/85"
          style={{ fontSize: "clamp(11px, 1vw, 14px)" }}
        >
          Coming Soon
        </div>
        <div className="mt-3 h-px w-16 bg-bone/25" />
      </div>
    </main>
  );
}
