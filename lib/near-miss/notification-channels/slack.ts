import { hazardLabel, severityLabel } from "@/shared/near-miss/constants";
import type { Severity } from "@/shared/near-miss/types";
import type {
  NotificationChannel,
  NotificationEvent,
} from "../notifications";

/**
 * Slack incoming-webhook channel. Fires Block Kit messages for
 * report_created (above the configured severity floor) and every
 * status_changed event.
 *
 * Failures are caught by the dispatcher; this channel never throws — a
 * Slack outage must not break a report write. We give the request a
 * tight timeout so a slow webhook doesn't stretch the response that
 * triggered it.
 */

const DEFAULT_TIMEOUT_MS = 2_000;

const SEVERITY_RANK: Record<Severity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

const SEVERITY_EMOJI: Record<Severity, string> = {
  low: ":white_circle:",
  medium: ":large_blue_circle:",
  high: ":large_orange_circle:",
  critical: ":rotating_light:",
};

export interface SlackChannelOptions {
  /** Slack incoming-webhook URL. Required. */
  webhookUrl: string;
  /** Optional public base URL of the safety surface for "Open report" links. */
  baseUrl?: string;
  /** Floor for report_created notifications. Default: "high". */
  minSeverity?: Severity;
  /** Override for tests. */
  fetchImpl?: typeof fetch;
  /** Timeout for the webhook request in ms. Default: 2000. */
  timeoutMs?: number;
}

export function slackChannel(opts: SlackChannelOptions): NotificationChannel {
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch?.bind(globalThis);
  if (!fetchImpl) throw new Error("Slack channel: no fetch implementation available");
  const minRank = SEVERITY_RANK[opts.minSeverity ?? "high"];
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return {
    name: "slack",
    shouldHandle(event) {
      switch (event.kind) {
        case "report_created":
          return SEVERITY_RANK[event.report.severityPotential] >= minRank;
        case "status_changed":
          return true;
        case "action_assigned":
          // Owner-specific pings belong on email/SMS, not in a shared
          // channel. Keep Slack focused on team-visible signals.
          return false;
      }
    },
    async send(event) {
      const payload = formatPayload(event, opts.baseUrl);
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        await fetchImpl(opts.webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(t);
      }
    },
  };
}

/**
 * Build the Block Kit payload. Exported for tests — no network in here.
 */
export function formatPayload(
  event: NotificationEvent,
  baseUrl?: string,
): Record<string, unknown> {
  switch (event.kind) {
    case "report_created": {
      const r = event.report;
      const reporter = r.anonymous ? "Anonymous reporter" : r.reporterName ?? "Unknown";
      const link = baseUrl
        ? `${baseUrl.replace(/\/$/, "")}/safety/near-misses/${r.id}`
        : null;
      return {
        text: `New ${r.severityPotential} near miss: ${r.reference} at ${r.locationText}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${SEVERITY_EMOJI[r.severityPotential]} New near miss reported`,
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Reference*\n\`${r.reference}\`` },
              { type: "mrkdwn", text: `*Severity*\n${severityLabel(r.severityPotential)}` },
              { type: "mrkdwn", text: `*Hazard*\n${hazardLabel(r.hazardCategory)}` },
              { type: "mrkdwn", text: `*Site*\n${r.siteId}` },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Location*\n${r.locationText}\n\n*Reporter*\n${reporter}`,
            },
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: truncate(r.description, 600) },
          },
          ...(link
            ? [
                {
                  type: "actions",
                  elements: [
                    {
                      type: "button",
                      text: { type: "plain_text", text: "Open report" },
                      url: link,
                      style: r.severityPotential === "critical" ? "danger" : "primary",
                    },
                  ],
                },
              ]
            : []),
        ],
      };
    }
    case "status_changed": {
      const r = event.report;
      const link = baseUrl
        ? `${baseUrl.replace(/\/$/, "")}/safety/near-misses/${r.id}`
        : null;
      return {
        text: `${r.reference}: ${event.from} → ${event.to}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                `*${link ? `<${link}|${r.reference}>` : r.reference}*` +
                ` — ${hazardLabel(r.hazardCategory)} at ${r.locationText}\n` +
                `_Status:_ \`${event.from}\` → \`${event.to}\``,
            },
          },
        ],
      };
    }
    // action_assigned filtered out by shouldHandle, included for type
    // exhaustiveness.
    case "action_assigned":
      return { text: `${event.report.reference}: action assigned to ${event.ownerName}` };
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
