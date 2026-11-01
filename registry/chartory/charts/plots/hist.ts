// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.hist (Figma ember-chart.js): histogram bins over a y grid (data/primary, the tail in data/seq-2), percentile
// marker lines with caps labels beside them, x labels on bin edges (first starts, past-the-end ends).
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type HistData = {
  vals: number[]; max: number; ticks: string[]; tailFrom: number; yW?: number;
  p: { i: number; label: string; tok: string; side?: "left" }[];
  xl: [number, string][];
};

export function hist(K: Kit, p: Frame, w: number, o: HistData): Frame {
  const pl = K.plot(p, "histogram", w, K.PH);
  const yW = o.yW ?? 36;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 4, w - yW - 4, o.vals.length, 0.2);
  o.vals.forEach((v, i) => {
    const h = K.h(v, o.max);
    K.rect(pl, "bin " + String(i + 1).padStart(2, "0"), bs[i].x, K.BASE - h, bs[i].w, h, i >= o.tailFrom ? "data/seq-2" : "data/primary", [2, 2, 0, 0])
      .motion = { kind: "grow", origin: "bottom", order: i, group: i };
  });
  o.p.forEach((m, k) => {
    const x = bs[m.i].x + Math.floor(bs[m.i].w / 2);
    // markers draw down from their label after the bins
    K.rect(pl, "marker · " + m.label.toLowerCase(), x, K.TOP + 16, 1, K.BASE - K.TOP - 16, m.tok).motion = { kind: "grow", origin: "top", order: o.vals.length + k, after: true };
    const t = K.caps(pl, m.label, m.tok === "data/primary-soft" ? "data/primary-soft" : "strong");
    t.x = m.side === "left" ? x - 6 - Math.ceil(t.w) : x + 6; t.y = K.TOP + 14;
    t.motion = { kind: "fade", order: o.vals.length + k, after: true };
  });
  for (const [e, t] of o.xl) {
    const x = e >= bs.length ? bs[bs.length - 1].x + bs[0].w : bs[e].x;
    K.xAt(pl, t, x, K.PH - 14, e === 0 ? "start" : e >= bs.length ? "end" : "center");
  }
  return pl;
}
