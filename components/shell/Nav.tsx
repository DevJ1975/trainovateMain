"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/marks/Wordmark";

const links = [
  { href: "/platform", label: "Platform" },
  { href: "/federal", label: "Federal" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-[1440px] px-6 md:px-10 transition-all duration-500 ${
          scrolled ? "max-w-[1240px]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between gap-6 transition-all duration-500 ${
            scrolled
              ? "tnv-glass rounded-full px-5 py-2"
              : "px-0 py-0 border-b border-bone/5"
          } ${scrolled ? "" : "pb-4"}`}
        >
          <Link href="/" className="flex items-center gap-2 group" aria-label="Trainovate home">
            <Wordmark className="text-xl text-bone group-hover:text-signal transition-colors" />
            <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-eyebrow text-fog border border-fog/30 px-1.5 py-0.5">
              SDVOSB
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {links.map((l) => {
              const active = pathname === l.href || pathname?.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-mono text-[11px] uppercase tracking-eyebrow transition-colors ${
                    active ? "text-signal" : "text-bone/70 hover:text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline-flex tnv-btn-signal">
              Request demo
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2 text-bone"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute inset-x-0 top-full mt-2 mx-6 tnv-glass rounded-2xl p-6 animate-fade-up">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-eyebrow text-bone/80 hover:text-signal"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="tnv-btn-signal mt-2 w-fit">
              Request demo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
