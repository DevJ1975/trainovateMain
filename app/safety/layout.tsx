import Link from "next/link";

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="border-b border-bone/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone">
            Trainovate.ai · Safety
          </Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/safety/near-misses" className="text-bone/85 hover:text-bone">
              Near misses
            </Link>
            <Link
              href="/report"
              className="rounded-md bg-cobalt px-3 py-1.5 text-bone hover:bg-cobalt/90"
            >
              + Report
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
