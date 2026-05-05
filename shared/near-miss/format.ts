/**
 * Platform-agnostic formatting helpers. Consumed by web and Expo.
 * Web-only helpers (Tailwind class strings, etc.) belong in lib/near-miss/.
 */

export function relativeTime(iso: string, nowMs: number = Date.now()): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";

  const ms = nowMs - t;
  if (ms < 0) {
    const future = -ms;
    if (future < 60_000) return "in <1m";
    const min = Math.round(future / 60_000);
    if (min < 60) return `in ${min}m`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `in ${hr}h`;
    return new Date(iso).toLocaleDateString();
  }

  const sec = Math.round(ms / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
