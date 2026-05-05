import Link from "next/link";
import { notFound } from "next/navigation";
import { getReport, listAttachments } from "@/lib/near-miss/store";
import { features } from "@/lib/features";
import {
  CONTRIBUTING_FACTOR_TYPES,
  hazardLabel,
  REPORT_STATUSES,
  ReportEvent,
  severityLabel,
} from "@/lib/near-miss/types";
import {
  relativeTime,
  severityBadgeClass,
  statusBadgeClass,
} from "@/lib/near-miss/format";
import {
  addAction,
  addCommentAction,
  addFactor,
  changeStatus,
  completeAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const report = getReport(params.id);
  if (!report) notFound();

  const photos = listAttachments(report.id);
  const occurred = new Date(report.occurredAt);
  const reported = new Date(report.reportedAt);

  const factorTypeLabel = (type: string) =>
    CONTRIBUTING_FACTOR_TYPES.find((t) => t.id === type)?.label ?? type;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="min-w-0">
        <Link
          href="/safety/near-misses"
          className="text-xs uppercase tracking-[0.18em] text-bone/55 hover:text-bone"
        >
          ← All near misses
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
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

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
          <Field label="Site" value={report.siteId} />
          <Field
            label="Occurred"
            value={`${occurred.toLocaleString()} · ${relativeTime(report.occurredAt)}`}
          />
          <Field label="Reported" value={relativeTime(report.reportedAt)} />
          <Field
            label="Reporter"
            value={report.anonymous ? "Anonymous" : report.reporterName ?? "Anonymous"}
          />
        </dl>

        <Section title="What happened">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-bone/85">
            {report.description}
          </p>
        </Section>

        {photos.length > 0 && (
          <Section title={`Photos (${photos.length})`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={`/api/attachments/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md border border-bone/10 bg-ink/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/attachments/${p.id}`}
                    alt="Reported photo"
                    className="aspect-square w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </Section>
        )}

        <Section title="Contributing factors">
          {report.contributingFactors.length === 0 ? (
            <p className="text-sm text-bone/50">None recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {report.contributingFactors.map((f) => (
                <li
                  key={f.id}
                  className="rounded-md border border-bone/10 bg-ink/40 px-3 py-2 text-sm"
                >
                  <span className="mr-2 rounded-full border border-bone/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-bone/65">
                    {factorTypeLabel(f.type)}
                  </span>
                  {f.note}
                </li>
              ))}
            </ul>
          )}

          <form action={addFactor.bind(null, report.id)} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select
              name="type"
              required
              defaultValue="equipment"
              className="rounded-md border border-bone/15 bg-ink/40 px-2 py-1.5 text-sm"
            >
              {CONTRIBUTING_FACTOR_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <input
              name="note"
              required
              minLength={3}
              placeholder="Add a contributing factor"
              className="flex-1 rounded-md border border-bone/15 bg-ink/40 px-3 py-1.5 text-sm placeholder:text-bone/30"
            />
            <button
              type="submit"
              className="rounded-md border border-bone/20 px-3 py-1.5 text-sm text-bone/85 hover:border-bone/40"
            >
              Add
            </button>
          </form>
        </Section>

        <Section title="Corrective actions">
          {report.correctiveActions.length === 0 ? (
            <p className="text-sm text-bone/50">No actions yet.</p>
          ) : (
            <ul className="space-y-2">
              {report.correctiveActions.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-2 rounded-md border border-bone/10 bg-ink/40 px-3 py-2 text-sm sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className={a.status === "done" ? "text-bone/55 line-through" : "text-bone"}>
                      {a.description}
                    </div>
                    <div className="mt-0.5 text-xs text-bone/55">
                      Owner: {a.ownerName}
                      {a.dueAt && ` · Due ${new Date(a.dueAt).toLocaleDateString()}`}
                      {a.completedAt && ` · Completed ${relativeTime(a.completedAt)}`}
                    </div>
                  </div>
                  {a.status !== "done" && (
                    <form action={completeAction.bind(null, report.id)}>
                      <input type="hidden" name="actionId" value={a.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-cobalt/40 bg-cobalt/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cobalt hover:bg-cobalt/20"
                      >
                        Mark done
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form
            action={addAction.bind(null, report.id)}
            className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_180px_160px_auto]"
          >
            <input
              name="description"
              required
              minLength={3}
              placeholder="What needs to happen?"
              className="rounded-md border border-bone/15 bg-ink/40 px-3 py-1.5 text-sm placeholder:text-bone/30"
            />
            <input
              name="ownerName"
              required
              placeholder="Owner"
              className="rounded-md border border-bone/15 bg-ink/40 px-3 py-1.5 text-sm placeholder:text-bone/30"
            />
            <input
              type="date"
              name="dueAt"
              className="rounded-md border border-bone/15 bg-ink/40 px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-md border border-bone/20 px-3 py-1.5 text-sm text-bone/85 hover:border-bone/40"
            >
              Add action
            </button>
          </form>
        </Section>

        {features().comments && (
          <Section title="Comments">
            <CommentsThread events={report.events} />
            <form
              action={addCommentAction.bind(null, report.id)}
              className="mt-4 flex flex-col gap-2"
            >
              <textarea
                name="text"
                required
                minLength={1}
                maxLength={5000}
                rows={3}
                placeholder="Add a comment for the safety team…"
                className="w-full resize-y rounded-md border border-bone/15 bg-ink/40 px-3 py-2 text-sm placeholder:text-bone/30 focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt"
              />
              <button
                type="submit"
                className="self-end rounded-md bg-cobalt px-3 py-1.5 text-sm text-bone hover:bg-cobalt/90"
              >
                Post comment
              </button>
            </form>
          </Section>
        )}
      </div>

      <aside className="space-y-6">
        <div className="rounded-md border border-bone/10 bg-ink/40 p-4">
          <h3 className="text-xs uppercase tracking-[0.18em] text-bone/55">Status</h3>
          <form action={changeStatus.bind(null, report.id)} className="mt-3 flex gap-2">
            <select
              name="status"
              defaultValue={report.status}
              className="flex-1 rounded-md border border-bone/15 bg-ink/40 px-2 py-1.5 text-sm"
            >
              {REPORT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-cobalt px-3 py-1.5 text-sm text-bone hover:bg-cobalt/90"
            >
              Update
            </button>
          </form>
        </div>

        <div className="rounded-md border border-bone/10 bg-ink/40 p-4">
          <h3 className="text-xs uppercase tracking-[0.18em] text-bone/55">Activity</h3>
          <ol className="mt-3 space-y-3">
            {[...report.events].reverse().map((e) => (
              <li key={e.id} className="text-sm">
                <div className="text-bone/85">
                  <span className="font-mono text-[11px] text-bone/55">
                    {e.kind.replace("_", " ")}
                  </span>{" "}
                  · {e.actorName}
                </div>
                <div className="text-xs text-bone/45">{relativeTime(e.at)}</div>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-bone/45">{label}</dt>
      <dd className="text-bone/90">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-bone/55">{title}</h2>
      {children}
    </section>
  );
}

function CommentsThread({ events }: { events: ReportEvent[] }) {
  const comments = events.filter((e) => e.kind === "commented");
  if (comments.length === 0) {
    return <p className="text-sm text-bone/50">No comments yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {comments.map((c) => {
        const text = String((c.payload as { text?: unknown } | undefined)?.text ?? "");
        return (
          <li
            key={c.id}
            className="rounded-md border border-bone/10 bg-ink/40 px-3 py-2 text-sm"
          >
            <div className="mb-1 flex items-baseline justify-between gap-2 text-xs text-bone/55">
              <span className="text-bone/85">{c.actorName}</span>
              <span>{relativeTime(c.at)}</span>
            </div>
            <div className="whitespace-pre-wrap text-bone/90">{text}</div>
          </li>
        );
      })}
    </ul>
  );
}
