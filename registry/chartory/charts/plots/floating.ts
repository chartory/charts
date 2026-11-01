// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.floating (Figma ember-chart-2.js): floating range bars (low → high) over a y grid, a median tick across each bar,
// bars whose low end misses the SLA in status/warning, and the SLA as a dashed line.
import type { Kit } from "../core/kit";
import { vector, type Frame } from "../core/node";

export type FloatingData = {
  cats: string[]; vals: [number, number, number][]; sla: number; min: number; max: number; ticks: string[];
  /** a colour per bar (then no SLA line: the colours carry their own rule) */
  toks?: string[];
  /** windows with no median: no tick across the bars */
  noMedian?: boolean;
};

export function floating(K: Kit, p: Frame, w: number, o: FloatingData): Frame {
  const pl = K.plot(p, "floating ranges", w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 8, w - yW - 8, o.cats.length, 0.9);
  const Y = (v: number) => K.yMap(v, o.min, o.max);
  for (let i = 0; i < o.cats.length; i++) {
    const [lo, hi, med] = o.vals[i];
    const b = bs[i];
    const bw = Math.min(16, b.w), x = b.x + Math.floor((b.w - bw) / 2);
    K.rect(pl, "range · " + o.cats[i].toLowerCase(), x, Y(hi), bw, Y(lo) - Y(hi), o.toks?.[i] ?? (lo < o.sla ? "data/primary" : "status/warning"), 4).motion = { kind: "grow", origin: "bottom", order: i, group: i };
    if (!o.noMedian) K.rect(pl, "median", x - 2, Y(med), bw + 4, 2, "text/strong").motion = { kind: "fade", order: i, group: i, after: true };
    K.xAt(pl, o.cats[i], b.x + Math.round(b.w / 2), K.PH - 14, "center");
  }
  // Figma: a LINE node (w − yW long) at the SLA level, 1 px dashed 4 / 4
  const ly = Y(o.sla);
  if (!o.toks) vector(pl, "sla", `M ${yW} ${ly} L ${w} ${ly}`, { stroke: { tok: "status/warning" }, sw: 1, dash: [4, 4] });
  return pl;
}
