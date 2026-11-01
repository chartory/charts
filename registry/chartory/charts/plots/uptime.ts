// C.uptime (Figma ember-chart-4.js): one row of day bars per service (coloured by state), the service name above
// on the left, its uptime on the right (warning when the row had an outage), the date range below.
import { place, type Kit } from "../core/kit";
import { collection, type Frame } from "../core/node";

export type UptimeData = { from: string; to: string; toks: Record<string, string>; rows: { label: string; text: string; days: string[] }[] };

export function uptime(K: Kit, p: Frame, w: number, o: UptimeData): Frame {
  const pl = K.plot(p, "uptime", w, K.PH);
  // XS and S with the legend on: 18 high bars in 46 rows, so the legend fits the 212 card (Figma 14:131336, 2026-10-20);
  // Signal keeps 22 / 50 at every size
  const tight = K.LEGEND_ON && (K.SIZE === "XS" || K.SIZE === "S") && !collection.signal;
  const k = o.rows.length, rh = tight ? 46 : 50, bh = tight ? 18 : 22;
  for (let r = 0; r < k; r++) {
    const row = o.rows[r], y = r * rh;
    const lb = K.T(pl, "Body/S", row.label, "strong");
    lb.name = "service · " + row.label.toLowerCase(); place(lb, 0, y);
    const t = K.caps(pl, row.text, row.days.includes("down") ? "status/warning" : "status/success");
    place(t, w - Math.ceil(t.w), y + 3);
    t.motion = { kind: "fade", order: row.days.length, group: r, after: true };
    const n = row.days.length, bw = Math.floor((w + 1) / n) - 1, off = Math.floor((w - (n * (bw + 1) - 1)) / 2);
    // day bars fade in left to right (oldest first); one hover group per service
    for (let i = 0; i < n; i++) K.rect(pl, "day " + (i + 1), off + i * (bw + 1), y + 22, bw, bh, o.toks[row.days[i]], 1).motion = { kind: "fade", order: i, group: r };
  }
  K.xAt(pl, o.from, 0, K.PH - 14, "start");
  K.xAt(pl, o.to, w, K.PH - 14, "end");
  return pl;
}
