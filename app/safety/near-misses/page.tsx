import Link from "next/link";
import { listReports, seedDemoData, statusCounts } from "@/lib/near-miss/store";
import { features } from "@/lib/features";
import {
  hazardLabel,
  REPORT_STATUSES,
  ReportStatus,
} from "@/lib/near-miss/types";
import {
  relativeTime,
  severityBadgeClass,
  statusBadgeClass,
} from "@/lib/near-miss/format";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { id: ReportStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...REPORT_STATUSES.map((s) => ({ id: s, label: titleCase(s) })),
];

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function NearMissListPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  seedDemoData();
  const all = listReports();
  const filter = (searchParams?.status as ReportStatus | "all") ?? "all";
  const filtered =
    filter === "all" ? all : all.filter((r) => r.status === filter);
  const counts = statusCounts();

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Near miss reports</h1>
          <p className="mt-1 text-sm text-bone/60">
            {all.length} total · {counts.new ?? 0} awaiting triage
          </p>
        </div>
        {features().csvExport && (
          <a
            href="/api/near-miss/reports/export"
            download
            className="rounded-md border border-bone/20 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-bone/85 hover:border-bone/40"
          >
            Export CSV
          </a>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (filter as string) === f.id;
          const count = f.id === "all" ? all.length : counts[f.id] ?? 0;
          return (
            <Link
              key={f.id}
              href={f.id === "all" ? "/safety/near-misses" : `/safety/near-misses?status=${f.id}`}
              className={
                "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] " +
                (active
                  ? "border-cobalt bg-cobalt/10 text-cobalt"
                  : "border-bone/15 text-bone/70 hover:border-bone/40")
              }
            >
              {f.label} <span className="ml-1 text-bone/45">{count}</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-bone/10 bg-ink/40 px-5 py-10 text-center text-sm text-bone/55">
          No reports {filter === "all" ? "yet" : `with status "${filter}"`}.
        </div>
      ) : (
        <ul className="divide-y divide-bone/10 rounded-md border border-bone/10 bg-ink/30">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link
                href={`/safety/near-misses/${r.id}`}
                className="flex flex-col gap-2 px-5 py-4 transition hover:bg-bone/5 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-xs text-bone/55">{r.reference}</span>
                  <span
                    className={
                      "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] " +
                      statusBadgeClass(r.status)
                    }
                  >
                    {r.status}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-bone">
                    {hazardLabel(r.hazardCategory)} — {r.locationText}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-bone/55">
                    {r.anonymous ? "Anonymous" : r.reporterName ?? "Anonymous"} · {relativeTime(r.reportedAt)}
                  </div>
                </div>

                <span
                  className={
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] " +
                    severityBadgeClass(r.severityPotential)
                  }
                >
                  {r.severityPotential}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
