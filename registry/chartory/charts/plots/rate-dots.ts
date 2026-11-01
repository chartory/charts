// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.rateDots (Figma ember-chart-4.js): a dot plot of projections per column over a y grid; equal values sit side by
// side (9 px apart, centred), and a short strong bar marks each column's median.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type RateDotsData = { cols: { label: string; dots: number[] }[]; min: number; max: number; ticks: string[] };

export function rateDots(K: Kit, p: Frame, w: number, o: RateDotsData): Frame {
  const pl = K.plot(p, "rate dots", w, K.PH);
  const yW = 44;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 8, w - yW - 8, o.cols.length, 0.3);
  for (let i = 0; i < o.cols.length; i++) {
    const c = o.cols[i], b = bs[i], cx = b.x + Math.round(b.w / 2);
    // a plain object, as the builder: integer keys ("3") iterate first, then the rest in insertion order
    const groups: Record<string, number> = {};
    for (const r of c.dots) groups[r] = (groups[r] ?? 0) + 1;
    for (const [r, k] of Object.entries(groups)) {
      const y = K.yMap(+r, o.min, o.max);
      for (let j = 0; j < k; j++) {
        const d = K.dot(pl, 6, "data/primary", "projection");
        d.x = cx + Math.round((j - (k - 1) / 2) * 9) - 3; d.y = y - 3;
        // dots pop column by column, left to right
        d.motion = { kind: "pop", order: i, group: i };
      }
    }
    const sorted = c.dots.slice().sort((a, b2) => a - b2);
    const med = sorted[Math.floor(sorted.length / 2)];
    K.rect(pl, "median · " + c.label.toLowerCase(), cx - 26, K.yMap(med, o.min, o.max) - 1, 52, 2, "strong", 1).motion = { kind: "fade", order: i, group: i, after: true };
    K.xAt(pl, c.label, cx, K.PH - 14, "center");
  }
  return pl;
}
