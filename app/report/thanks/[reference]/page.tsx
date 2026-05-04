import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportByReference } from "@/lib/near-miss/store";

export default function ThanksPage({
  params,
}: {
  params: { reference: string };
}) {
  const report = getReportByReference(params.reference);
  if (!report) notFound();

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-xl px-5 py-16 sm:py-24">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55">
          Trainovate.ai
        </div>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          Thanks — report received.
        </h1>

        <p className="mt-4 text-sm text-bone/70">
          The safety team for your site will see this in their queue. Reference:
        </p>

        <div className="mt-3 rounded-md border border-bone/15 bg-ink/40 px-4 py-3 font-mono text-lg text-bone">
          {report.reference}
        </div>

        {report.anonymous && report.receiptCode && (
          <div className="mt-6 rounded-md border border-flare/30 bg-flare/5 px-4 py-3 text-sm text-bone/85">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-flare">
              Anonymous receipt code
            </div>
            <div className="font-mono text-base">{report.receiptCode}</div>
            <p className="mt-2 text-xs text-bone/60">
              Save this code. It&apos;s the only way to check status without revealing
              your identity. We don&apos;t store who you are.
            </p>
            <p className="mt-2 text-xs text-bone/60">
              Check status anytime at{" "}
              <Link
                href={`/report/status/${report.receiptCode}`}
                className="text-cobalt hover:underline"
              >
                /report/status
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/report" className="text-cobalt hover:underline">
            File another
          </Link>
          <span className="text-bone/30">·</span>
          <Link href="/report/status" className="text-bone/70 hover:text-bone">
            Check status
          </Link>
          <span className="text-bone/30">·</span>
          <Link href="/" className="text-bone/60 hover:text-bone">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
