import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Check report status · Trainovate" };

async function lookup(formData: FormData) {
  "use server";
  const raw = ((formData.get("code") as string) ?? "").trim().toUpperCase();
  if (!raw) return;
  redirect(`/report/status/${encodeURIComponent(raw)}`);
}

export default function StatusLookupPage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone"
        >
          ← Trainovate.ai
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          Check your report
        </h1>
        <p className="mt-3 text-sm text-bone/70">
          Paste the receipt code you got after filing an anonymous report. Your
          identity stays private.
        </p>

        <form action={lookup} className="mt-8 flex gap-2">
          <input
            name="code"
            required
            autoFocus
            placeholder="e.g. A1B2C3D4"
            className="flex-1 rounded-md border border-bone/15 bg-ink/40 px-3 py-2 font-mono uppercase tracking-[0.18em] text-bone placeholder:text-bone/30 focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
          />
          <button
            type="submit"
            className="rounded-md bg-cobalt px-4 py-2 text-sm text-bone hover:bg-cobalt/90"
          >
            Look up
          </button>
        </form>

        <p className="mt-6 text-xs text-bone/45">
          Lost your code? It&apos;s not recoverable — that&apos;s the point. File a
          new report if you need to add information.
        </p>
      </div>
    </main>
  );
}
