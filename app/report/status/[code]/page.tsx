import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportByReceiptCode, listAttachments } from "@/lib/near-miss/store";
import {
  hazardLabel,
  severityLabel,
} from "@/lib/near-miss/types";
import {
  relativeTime,
  severityBadgeClass,
  statusBadgeClass,
} from "@/lib/near-miss/format";

export const dynamic = "force-dynamic";

export default function ReporterStatusPage({
  params,
}: {
  params: { code: string };
}) {
  const code = decodeURIComponent(params.code);
  const report = getReportByReceiptCode(code);
  if (!report) notFound();

  const photos = listAttachments(report.id);

  // Anonymity guard: hide internal triage notes (contributing factors are
  // safety-team working assumptions and may name people).
  const visibleEvents = report.events.filter(
    (e) => e.kind !== "factor_added",
  );

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/55 hover:text-bone"
        >
          ← Trainovate.ai
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="font-mono text-sm text-bone/60">{report.reference}</span>
          <span
            className={
              "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] " +
              statusBadgeClass(report.status)
            }
          >
            {report.status}
          </span>
          <span
            className={
              "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] " +
              severityBadgeClass(report.severityPotential)
            }
          >
            {severityLabel(report.severityPotential)}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {hazardLabel(report.hazardCategory)} — {report.locationText}
        </h1>

        <p className="mt-2 text-xs text-bone/55">
          Reported {relativeTime(report.reportedAt)} · anonymous
        </p>

        <section className="mt-8">
          <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-bone/55">
            What you reported
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-bone/85">
            {report.description}
          </p>
        </section>

        {photos.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/55">
              Photos you uploaded
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={`/api/attachments/${p.id}?code=${encodeURIComponent(code)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md border border-bone/10 bg-ink/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/attachments/${p.id}?code=${encodeURIComponent(code)}`}
                    alt="Photo you uploaded"
                    className="aspect-square w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/55">
            Corrective actions
          </h2>
          {report.correctiveActions.length === 0 ? (
            <p className="text-sm text-bone/50">
              No actions yet. The safety team will update this as they
              investigate.
            </p>
          ) : (
            <ul className="space-y-2">
              {report.correctiveActions.map((a) => (
                <li
                  key={a.id}
                  className="rounded-md border border-bone/10 bg-ink/40 px-3 py-2 text-sm"
                >
                  <div className={a.status === "done" ? "text-bone/55 line-through" : "text-bone"}>
                    {a.description}
                  </div>
                  <div className="mt-0.5 text-xs text-bone/55">
                    {a.status === "done"
                      ? `Completed ${a.completedAt ? relativeTime(a.completedAt) : ""}`
                      : a.dueAt
                        ? `Due ${new Date(a.dueAt).toLocaleDateString()}`
                        : "In progress"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/55">
            Activity
          </h2>
          <ol className="space-y-3">
            {[...visibleEvents].reverse().map((e) => (
              <li key={e.id} className="text-sm">
                <div className="text-bone/85">
                  {labelForKind(e.kind)} · {relativeTime(e.at)}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-12 text-xs text-bone/45">
          This page only shows what&apos;s safe to share. Internal triage notes
          aren&apos;t visible here.
        </p>
      </div>
    </main>
  );
}

function labelForKind(kind: string): string {
  switch (kind) {
    case "created": return "Report submitted";
    case "status_changed": return "Status updated";
    case "action_added": return "Corrective action added";
    case "action_completed": return "Corrective action completed";
    case "commented": return "Comment added";
    default: return kind.replace(/_/g, " ");
  }
}
