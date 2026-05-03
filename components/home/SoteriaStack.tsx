"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { products } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function SoteriaStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      const idx = Math.min(products.length - 1, Math.floor(p * products.length));
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative tnv-section"
      style={{ height: `${products.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="tnv-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: stack visualization */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/4]">
                {products.map((p, i) => {
                  const isActive = i === active;
                  const dist = i - active;
                  return (
                    <div
                      key={p.slug}
                      className="absolute inset-x-0 transition-all duration-700 ease-out tnv-glass rounded-md"
                      style={{
                        top: `${20 + i * 16}%`,
                        height: "30%",
                        transform: `translateY(${dist * -8}px) translateZ(0) rotateX(${dist * -2}deg) scale(${
                          isActive ? 1 : 0.94 - Math.abs(dist) * 0.02
                        })`,
                        opacity: isActive ? 1 : 0.45 - Math.abs(dist) * 0.08,
                        zIndex: products.length - Math.abs(dist),
                        borderColor: isActive ? "rgba(0,70,230,0.6)" : undefined,
                        boxShadow: isActive
                          ? "0 30px 80px -20px rgba(0,70,230,0.45)"
                          : "none",
                      }}
                    >
                      <div className="h-full p-6 flex items-end">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                            {p.index}
                          </div>
                          <div className="font-serif text-2xl text-bone mt-2 tracking-tight">
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: active product detail */}
            <div className="lg:col-span-7">
              <Eyebrow index="02" label="THE SOTERIA STACK" />
              <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">
                Four products. <span className="tnv-italic text-signal">One spine.</span>
              </h2>
              <p className="tnv-body mt-6 max-w-lg text-pretty">
                Soteria connects an LOTO program to a field inspection to a
                training module to an incident report — through a single xAPI
                evidence stream.
              </p>

              <div className="mt-12 min-h-[280px]">
                {products.map((p, i) => {
                  const Mark = p.mark;
                  return (
                    <div
                      key={p.slug}
                      className="absolute transition-all duration-700"
                      style={{
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? "translateY(0)" : "translateY(20px)",
                        pointerEvents: i === active ? "auto" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Mark className="h-7 w-7 text-signal" />
                        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                          0{i + 1} / 0{products.length}
                        </div>
                      </div>
                      <h3 className="font-serif text-4xl md:text-5xl mt-4 text-bone tracking-tight text-balance max-w-xl">
                        {p.full}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-signal mt-3">
                        {p.role}
                      </p>
                      <p className="tnv-body mt-6 max-w-lg text-pretty">{p.tagline}</p>

                      <ul className="mt-6 space-y-2 max-w-md">
                        {p.features.slice(0, 3).map((f) => (
                          <li
                            key={f.title}
                            className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/70 flex items-start gap-2"
                          >
                            <span className="text-signal">→</span>
                            <span>{f.title}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/platform/${p.slug}`}
                        className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-signal hover:text-signal-soft border-b border-signal/40 hover:border-signal-soft pb-1"
                      >
                        Explore {p.name}
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
