import Link from "next/link";
import { SubmissionForm } from "./SubmissionForm";

export const metadata = {
  title: "Report a near miss · Trainovate",
};

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-xl px-5 py-10 sm:py-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone">
          ← Trainovate.ai
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          Report a near miss
        </h1>
        <p className="mt-3 text-sm text-bone/70">
          A near miss is something that <em>could</em> have caused harm but didn&apos;t.
          Capturing it now helps us fix the conditions before someone gets hurt.
          Most reports take under a minute.
        </p>

        <div className="mt-10">
          <SubmissionForm />
        </div>
      </div>
    </main>
  );
}
