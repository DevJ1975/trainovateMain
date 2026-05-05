import { dispatch } from "../notifications";
import { findOverdueActions, markOverdueNotified } from "../store";

export interface NotifyOverdueResult {
  scanned: number;
  notified: number;
  notifiedIds: string[];
}

/**
 * One pass of the overdue-action notifier. Idempotent — each action is
 * notified at most once per cooldown window (default 20h, set in
 * findOverdueActions). Safe to invoke from a cron, an API route, or a
 * CLI.
 */
export function notifyOverdue(now: number = Date.now()): NotifyOverdueResult {
  const overdue = findOverdueActions(now);
  const notifiedIds: string[] = [];

  for (const o of overdue) {
    const dueAt = o.action.dueAt;
    if (!dueAt) continue;
    const hoursOverdue = (now - new Date(dueAt).getTime()) / (60 * 60 * 1000);

    dispatch({
      kind: "action_overdue",
      report: o.report,
      actionId: o.action.id,
      ownerName: o.action.ownerName,
      description: o.action.description,
      dueAt,
      hoursOverdue,
    });

    markOverdueNotified(o.action.id, now);
    notifiedIds.push(o.action.id);
  }

  return {
    scanned: overdue.length,
    notified: notifiedIds.length,
    notifiedIds,
  };
}
