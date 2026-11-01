// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.combo (Figma ember-chart-3.js): columns on the left axis, a smooth line with ringed points on a second axis whose
// tick labels sit at the right edge in the line's colour; x labels only at the chosen indexes.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ComboData = {
  cats: string[]; xl: number[];
  bars: { tok: string; vals: number[]; max: number; ticks: string[] };
  line: { tok: string; vals: number[]; max: number; ticks: string[] };
};

export function combo(K: Kit, p: Frame, w: number, o: ComboData): Frame {
  const pl = K.plot(p, "combo", w, K.PH);
  const yW = 40, rW = 34;
  K.yGrid(pl, o.bars.ticks, yW, w - rW);
  const step = (K.BASE - K.TOP) / (o.line.ticks.length - 1);
  for (let i = 0; i < o.line.ticks.length; i++) {
    const t = K.caps(pl, o.line.ticks[i], o.line.tok);
    t.name = "y2 · " + o.line.ticks[i]; t.x = w - Math.ceil(t.w); t.y = K.TOP + Math.round(i * step) - 7;
  }
  const bs = K.bands(yW + 8, w - rW - yW - 16, o.cats.length, 0.6);
  const pts: [number, number][] = [];
  for (let i = 0; i < o.cats.length; i++) {
    const b = bs[i], h = K.h(o.bars.vals[i], o.bars.max);
    K.rect(pl, "bar · " + o.cats[i].toLowerCase(), b.x, K.BASE - h, b.w, h, o.bars.tok, [3, 3, 0, 0]).motion = { kind: "grow", origin: "bottom", order: i, group: i };
    pts.push([b.x + Math.round(b.w / 2), K.yMap(o.line.vals[i], 0, o.line.max)]);
    if (o.xl.includes(i)) K.xAt(pl, o.cats[i], b.x + Math.round(b.w / 2), K.PH - 14, "center");
  }
  K.vec(pl, "line · rate", K.path(pts, true), { stroke: o.line.tok, sw: 2 }).motion = { kind: "draw", order: o.cats.length };
  pts.forEach(([px, py], i) => {
    const d = K.ring(pl, "point", px, py, 8, o.line.tok);
    d.sw = 2; d.x = Math.round(d.x); d.y = Math.round(d.y);
    d.motion = { kind: "pop", order: i, group: i, after: true };
  });
  return pl;
}
