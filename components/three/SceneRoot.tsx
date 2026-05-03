"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { ScrollScene } from "./ScrollScene";

export function SceneRoot() {
  const [mounted, setMounted] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const mob = window.matchMedia("(max-width: 768px)");
    setIsMobile(mob.matches);
    const onR = () => setReduce(mq.matches);
    const onM = () => setIsMobile(mob.matches);
    mq.addEventListener("change", onR);
    mob.addEventListener("change", onM);
    return () => {
      mq.removeEventListener("change", onR);
      mob.removeEventListener("change", onM);
    };
  }, []);

  if (!mounted || reduce) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 28%, rgba(0,70,230,0.28), transparent 55%), radial-gradient(ellipse at 50% 75%, rgba(255,107,26,0.16), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 grid-noise opacity-50" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        style={{ background: "#0A0A0A" }}
      >
        <Suspense fallback={null}>
          <ScrollScene mobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
