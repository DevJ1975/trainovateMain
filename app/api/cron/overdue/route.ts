import { NextRequest } from "next/server";
import { notifyOverdue } from "@/lib/near-miss/cron/notify-overdue";
import { error, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

/**
 * Hourly nudge for overdue corrective actions. Authentication:
 *
 *  - On Vercel Cron: the platform sends `x-vercel-cron: 1`. Trusted
 *    automatically — Vercel won't proxy this header from external
 *    requests. (https://vercel.com/docs/cron-jobs/manage-cron-jobs)
 *  - Anywhere else: pass `Authorization: Bearer <CRON_SECRET>` matching
 *    the env var. Required outside Vercel — set in your scheduler's
 *    secret store.
 *
 * Schedule lives in vercel.json. For self-hosted: any cron runner
 * (systemd timers, GH Actions schedule, traditional crontab) calling
 * curl with the bearer header works.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  try {
    const result = notifyOverdue();
    return json({ ok: true, ...result });
  } catch (err) {
    return error(500, "Cron run failed", {
      message: (err as Error).message,
    });
  }
}

// Vercel Cron sends POST in some configurations; accept both.
export const POST = GET;

function isAuthorized(req: NextRequest): boolean {
  if (req.headers.get("x-vercel-cron")) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // No secret configured. Refuse outside dev so a misconfigured
    // production deploy doesn't accidentally expose the endpoint to
    // anyone.
    return process.env.NODE_ENV !== "production";
  }
  const auth = req.headers.get("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return false;
  return auth.slice(7).trim() === secret;
}
