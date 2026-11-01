// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.cohort (Figma ember-chart.js): a cohort triangle: column labels on top, cohort names on the left, cells on the
// sequential ramp between lo and hi, each with its value (strong from step 3 up, body below).
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type CohortData = { cohorts: { label: string; vals: number[] }[]; cols: string[]; lo: number; hi: number; fmt: (v: number) => string; yW?: number };

export function cohort(K: Kit, p: Frame, w: number, o: CohortData): Frame {
  const pl = K.plot(p, "cohort", w, K.PH);
  const yW = o.yW ?? 64, g = 3, top = 20, n = o.cohorts.length;
  const cx = K.bands(yW, w - yW, o.cols.length, 0.03);
  const rh = Math.floor((K.PH - top - (n - 1) * g) / n);
  for (let c = 0; c < o.cols.length; c++) K.xAt(pl, o.cols[c], cx[c].x + Math.round(cx[c].w / 2), 0, "center");
  let order = 0;
  for (let r = 0; r < n; r++) {
    const co = o.cohorts[r], y = top + r * (rh + g);
    const t = K.caps(pl, co.label, "axis");
    t.x = 0; t.y = y + Math.round((rh - 14) / 2);
    for (let c = 0; c < co.vals.length; c++) {
      const v = co.vals[c], k = Math.max(1, Math.min(6, Math.ceil(((v - o.lo) / (o.hi - o.lo)) * 6)));
      // cells fade in reading order, each value right after its cell
      const i = order++;
      K.rect(pl, "cell " + co.label.toLowerCase() + " · " + o.cols[c].toLowerCase(), cx[c].x, y, cx[c].w, rh, "data/seq-" + k, 3).motion = { kind: "fade", order: i, group: i };
      const vt = K.T(pl, "Label/S", o.fmt(v), k >= 3 ? "strong" : "body");
      vt.x = Math.round(cx[c].x + (cx[c].w - Math.ceil(vt.w)) / 2); vt.y = y + Math.round((rh - vt.h) / 2);
      vt.motion = { kind: "fade", order: i, group: i, after: true };
    }
  }
  return pl;
}
