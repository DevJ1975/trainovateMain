import { NearMissReport, ReportStatus, Severity } from "./types";

/**
 * Notification dispatcher. Channels are pluggable — the dev build wires up a
 * console channel only. Production implementations should add Slack/email/SMS
 * adapters here (or behind a worker queue) and gate them on customer org
 * preferences before dispatch.
 */

export type NotificationEvent =
  | { kind: "report_created"; report: NearMissReport }
  | {
      kind: "status_changed";
      report: NearMissReport;
      from: ReportStatus;
      to: ReportStatus;
    }
  | {
      kind: "action_assigned";
      report: NearMissReport;
      ownerName: string;
      description: string;
    };

export interface NotificationChannel {
  name: string;
  shouldHandle(event: NotificationEvent): boolean;
  send(event: NotificationEvent): Promise<void> | void;
}

const channels: NotificationChannel[] = [];

export function registerChannel(channel: NotificationChannel) {
  channels.push(channel);
}

export function dispatch(event: NotificationEvent) {
  for (const ch of channels) {
    if (!ch.shouldHandle(event)) continue;
    try {
      const r = ch.send(event);
      if (r && typeof (r as Promise<void>).catch === "function") {
        (r as Promise<void>).catch((err) => {
          // Notification failures must never fail a report write.
          console.error(`[notifications:${ch.name}] send failed`, err);
        });
      }
    } catch (err) {
      console.error(`[notifications:${ch.name}] send threw`, err);
    }
  }
}

// ----- Default channel: console -----

const HIGH_SEVERITY: Severity[] = ["high", "critical"];

export const consoleChannel: NotificationChannel = {
  name: "console",
  shouldHandle(event) {
    if (event.kind === "report_created") {
      return HIGH_SEVERITY.includes(event.report.severityPotential);
    }
    return true;
  },
  send(event) {
    switch (event.kind) {
      case "report_created":
        console.log(
          `[notify] new ${event.report.severityPotential} near miss ${event.report.reference} at ${event.report.locationText}`,
        );
        return;
      case "status_changed":
        console.log(
          `[notify] ${event.report.reference}: ${event.from} → ${event.to}`,
        );
        return;
      case "action_assigned":
        console.log(
          `[notify] ${event.report.reference}: action assigned to ${event.ownerName} — "${event.description}"`,
        );
        return;
    }
  },
};

registerChannel(consoleChannel);

/**
 * Channel adapters to add for production:
 *
 *   slackChannel({ webhookUrl, routeByOrg })       — high/critical reports
 *   emailChannel({ ses, defaultFrom })             — daily digest + owner pings
 *   smsChannel({ twilio, escalationRoster })       — critical only, business hrs
 *
 * Each implements NotificationChannel and is registered with registerChannel().
 * Per-channel rate limits, quiet hours, and org-level opt-outs belong in
 * shouldHandle().
 */
