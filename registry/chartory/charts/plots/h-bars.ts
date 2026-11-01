// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.hBars (Figma ember-chart.js): horizontal two-layer bars (total behind, value in front) with the row label inside
// the bar, the value in a right column, and vertical grid lines with x ticks under the rows.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type HBarsData = {
  max: number; ticks: string[]; tokTotal: string; tokValue: string; valueCol?: number;
  rows: { label: string; total: number; value: number; text: string }[];
};

export function hBars(K: Kit, p: Frame, w: number, o: HBarsData): Frame {
  const vc = o.valueCol ?? 72, B = w - vc, n = o.rows.length;
  const slot = Math.floor((K.BASE + 11) / n), rowH = Math.min(28, slot - 11), gap = slot - rowH;
  const pl = K.plot(p, "bars", w, K.PH);
  for (let i = 0; i < o.ticks.length; i++) {
    const x = Math.round((i * B) / (o.ticks.length - 1));
    if (i > 0) K.rect(pl, "grid-line " + String(i + 1).padStart(2, "0"), x, 0, 1, K.BASE, "grid");
    const t = K.caps(pl, o.ticks[i], "axis");
    t.name = "x · " + o.ticks[i];
    t.x = i === 0 ? 0 : i === o.ticks.length - 1 ? x - Math.ceil(t.w) : x - Math.round(t.w / 2);
    t.y = K.PH - 14;
  }
  for (let i = 0; i < n; i++) {
    const r = o.rows[i], y = i * (rowH + gap), nm = r.label.toLowerCase();
    // horizontal bars open from the left edge (a wipe; no horizontal grow origin yet)
    K.rect(pl, "bar · " + nm + " · total", 0, y, Math.round((r.total / o.max) * B), rowH, o.tokTotal, 4).motion = { kind: "reveal", order: i, group: i };
    K.rect(pl, "bar · " + nm + " · value", 0, y, Math.round((r.value / o.max) * B), rowH, o.tokValue, 4).motion = { kind: "reveal", order: i, group: i, after: true };
    const t = K.caps(pl, r.label, "strong");
    t.name = "label · " + nm; t.x = 8; t.y = y + Math.round((rowH - 14) / 2);
    const v = K.T(pl, "Label/S", r.text, "strong");
    v.name = "value · " + nm; v.x = w - Math.ceil(v.w); v.y = y + Math.round((rowH - v.h) / 2);
    v.motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
