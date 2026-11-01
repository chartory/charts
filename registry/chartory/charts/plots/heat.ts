// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.heat (Figma ember-chart.js): a heatmap of rounded cells on the sequential ramp (data/idle under 0.1), row names on
// the left, chosen column labels below, and marked cells carrying their value.
import type { Kit } from "../core/kit";
import { collection, type Frame } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type HeatData = { rows: string[]; cols: string[]; xl: Record<number, string>; vals: number[][]; marks?: Record<string, string>; yW?: number; gap?: number };

export function heat(K: Kit, p: Frame, w: number, o: HeatData): Frame {
  if (collection.signal) return signalPlot("heat")(K, p, w, o); // Signal: charts/signal/plots/heat.ts (@chartory/signal)
  const pl = K.plot(p, "heatmap", w, K.PH);
  const yW = o.yW ?? 36, g = o.gap ?? 3;
  const cx = K.bands(yW, w - yW, o.cols.length, g / ((w - yW) / o.cols.length));
  const hAvail = K.PH - 22, rh = Math.floor((hAvail - (o.rows.length - 1) * g) / o.rows.length);
  for (let r = 0; r < o.rows.length; r++) {
    const y = r * (rh + g);
    const t = K.caps(pl, o.rows[r], "axis");
    t.x = yW - 8 - Math.ceil(t.w); t.y = y + Math.round((rh - 14) / 2);
    for (let c = 0; c < o.cols.length; c++) {
      const v = o.vals[r][c], tok = v < 0.1 ? "data/idle" : "data/seq-" + Math.min(6, Math.ceil(v * 6));
      // cells fade in reading order (left to right, top to bottom)
      const order = r * o.cols.length + c;
      K.rect(pl, "cell " + o.rows[r].toLowerCase() + " · " + o.cols[c].toLowerCase(), cx[c].x, y, cx[c].w, rh, tok, 3).motion = { kind: "fade", order, group: order };
      const m = o.marks?.[r + "," + c];
      if (m) {
        const mt = K.caps(pl, m, "strong");
        mt.x = Math.round(cx[c].x + (cx[c].w - Math.ceil(mt.w)) / 2); mt.y = y + Math.round((rh - 14) / 2);
        mt.motion = { kind: "fade", order, group: order, after: true };
      }
    }
  }
  for (const [i, t] of Object.entries(o.xl)) { const c = +i; K.xAt(pl, t, cx[c].x + Math.round(cx[c].w / 2), K.PH - 14, "center"); }
  return pl;
}
