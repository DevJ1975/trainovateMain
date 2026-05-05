"use client";

import Link from "next/link";

export default function SafetyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-md border border-flare/40 bg-flare/5 px-5 py-6">
      <h2 className="text-lg font-semibold text-bone">Something went wrong</h2>
      <p className="mt-2 text-sm text-bone/70">{error.message || "Unknown error."}</p>
      {error.digest && (
        <p className="mt-1 font-mono text-[10px] text-bone/45">
          digest: {error.digest}
        </p>
      )}
      <div className="mt-4 flex gap-3 text-sm">
        <button
          onClick={reset}
          className="rounded-md border border-bone/20 px-3 py-1.5 text-bone/85 hover:border-bone/40"
        >
          Try again
        </button>
        <Link
          href="/safety/near-misses"
          className="rounded-md bg-cobalt px-3 py-1.5 text-bone hover:bg-cobalt/90"
        >
          Back to queue
        </Link>
      </div>
    </div>
  );
}
