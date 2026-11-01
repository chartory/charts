// C.calendar (Figma ember-chart-2.js, type 25): a week-column calendar heatmap: a cell per day (Mon → Sun down the
// column) on the sequential ramp (0 = idle, -1 = not yet), MON / WED / FRI on the left, month names over their first
// week, and a LESS → MORE scale at the bottom right.
import type { Kit } from "../core/kit";
import { layout, rect, type Frame } from "../core/node";

export type CalendarData = { vals: number[][]; months: Record<number, string> };

export function calendar(K: Kit, p: Frame, w: number, o: CalendarData): Frame {
  const pl = K.plot(p, "calendar heatmap", w, K.PH);
  const yW = 28, cols = o.vals.length;
  const s = Math.floor(Math.min((w - yW) / cols, (K.PH - 40) / 7));
  const g = 3, c = s - g;
  for (const [r, l] of [[0, "MON"], [2, "WED"], [4, "FRI"]] as [number, string][]) {
    const t = K.caps(pl, l, "axis"); t.x = 0; t.y = 18 + r * s + Math.round((c - 14) / 2);
  }
  for (const [i, l] of Object.entries(o.months)) { const t = K.caps(pl, l, "axis"); t.x = yW + +i * s; t.y = 0; }
  // cells fade in week by week, left to right
  for (let x = 0; x < cols; x++)
    for (let d = 0; d < 7; d++) {
      const v = o.vals[x][d];
      const tok = v < 0 ? null : v === 0 ? "data/idle" : "data/seq-" + Math.min(6, v);
      if (!tok) continue;
      const r = K.rect(pl, "day " + x + "·" + d, yW + x * s, 18 + d * s, c, c, tok, 2);
      r.motion = { kind: "fade", order: x };
    }
  const lg = K.AL(pl, "scale", "HORIZONTAL", { gap: 4, cross: "CENTER" });
  K.caps(lg, "LESS");
  for (const t of ["data/idle", "data/seq-2", "data/seq-4", "data/seq-6"]) rect(lg, "Rectangle", 0, 0, 10, 10, { tok: t }, 2);
  K.caps(lg, "MORE");
  layout(lg);
  lg.x = w - Math.ceil(lg.w); lg.y = K.PH - 14;
  return pl;
}
