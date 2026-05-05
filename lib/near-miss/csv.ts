/**
 * Tiny CSV writer — RFC 4180 escaping (double-quotes around any cell
 * containing comma/quote/newline; quotes within doubled). Pure, no
 * deps. Don't reach for csv-stringify just for triage exports.
 */
export function toCsvRow(cells: (string | number | boolean | null | undefined)[]): string {
  return cells.map(escapeCell).join(",");
}

export function toCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const lines = [toCsvRow(headers), ...rows.map(toCsvRow)];
  // CRLF per RFC 4180 — Excel is happiest with this.
  return lines.join("\r\n") + "\r\n";
}

function escapeCell(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
