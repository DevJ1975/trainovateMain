/**
 * DevBanner — thin top strip indicating the site is under active development.
 * Visible on every page, mono-small, on-brand. Not dismissible by design —
 * the disclosure should always be visible until launch.
 */
export function DevBanner() {
  return (
    <div
      role="status"
      aria-label="Site under active development"
      className="fixed top-0 inset-x-0 z-50 h-7 flex items-center justify-center gap-3 px-4 bg-ink-soft/95 backdrop-blur-md border-b border-bone/10 font-mono text-[10px] uppercase tracking-[0.24em]"
    >
      <span className="flex items-center gap-2 text-flare">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-flare opacity-60 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flare" />
        </span>
        <span>Active build</span>
      </span>
      <span className="hidden sm:inline text-fog">·</span>
      <span className="hidden sm:inline text-fog">
        Site under development — copy & links are evolving
      </span>
      <span className="sm:hidden text-fog">In development</span>
    </div>
  );
}
