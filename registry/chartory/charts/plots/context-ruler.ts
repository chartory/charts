// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.contextRuler (Figma ember-chart-5.js, type 81): one row per request, the context window as a chip track and the
// prompt kinds stacked left to right in it (1 px seams), tick lines with K labels on top, a dashed compaction line.
import { box, dash, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ContextRulerData = {
  max: number; limit: number; ticks: number[];
  kinds: { label: string; tok: string }[];
  rows: { label: string; segs: number[] }[];
};

export function contextRuler(K: Kit, p: Frame, w: number, o: ContextRulerData): Frame {
  const pl = K.plot(p, "context ruler", w, K.PH);
  const lW = 76, x = (v: number) => lW + Math.round((v / o.max) * (w - lW)), k = o.rows.length, rh = Math.floor((K.PH - 34) / k), top = 22;
  for (const v of o.ticks) {
    K.rect(pl, "tick · " + v, x(v), top - 4, 1, k * rh, "grid");
    const t = K.caps(pl, v === 0 ? "0" : v + "K", "axis");
    place(t, v === o.max ? x(v) - Math.ceil(t.w) : v === 0 ? x(v) : x(v) - Math.ceil(t.w) / 2, 0);
  }
  dash(K, pl, "compaction", "M " + x(o.limit) + " " + (top - 8) + " L " + x(o.limit) + " " + (top - 4 + k * rh), "status/warning", 1.5);
  for (let r = 0; r < k; r++) {
    const row = o.rows[r];
    const y = top + r * rh + Math.round((rh - 18) / 2);
    const lb = K.caps(pl, row.label, "body");
    place(lb, 0, y + 2);
    box(K, pl, "window · " + row.label.toLowerCase(), lW, y, w - lW, 18, "chipFill", 4);
    let acc = 0;
    row.segs.forEach((v, j) => {
      if (!v) return;
      const x0 = x(acc), x1 = x(acc + v);
      // the kinds fill the window left to right, one request after the other
      box(K, pl, o.kinds[j].label.toLowerCase(), x0, y, x1 - x0 - (j < row.segs.length - 1 ? 1 : 0), 18, o.kinds[j].tok, 3).motion =
        { kind: "grow", origin: "left", order: r * row.segs.length + j, group: r };
      acc += v;
    });
  }
  return pl;
}
