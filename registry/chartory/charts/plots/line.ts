// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.line (Figma ember-chart.js): line or area over a y grid; optional smooth curve, flat or gradient area (data/area-top
// → data/area-bottom), ringed points, an end point with a halo, a tooltip, and x labels at chosen points (first
// starts, last ends, others centre).
import type { Kit } from "../core/kit";
import { collection, type Frame, layout, text } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type LineData = {
  vals: number[]; min: number; max: number; ticks: string[]; xl: Record<number, string>; yW?: number;
  smooth?: boolean; area?: "flat" | "gradient"; dots?: "all" | number[]; end?: boolean; tip?: { i: number; text: string };
};

export function line(K: Kit, p: Frame, w: number, o: LineData): Frame {
  if (collection.signal) return signalPlot("line")(K, p, w, o); // Signal: charts/signal/plots/line.ts (@chartory/signal)
  const pl = K.plot(p, "line", w, K.PH);
  const yW = o.yW ?? 36;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.vals.length;
  const pts = o.vals.map((v, i) => [yW + Math.round((i * (w - yW)) / (n - 1)), K.yMap(v, o.min, o.max)] as [number, number]);
  if (o.area) {
    const d = K.path(pts, o.smooth) + " L " + pts[n - 1][0] + " " + K.BASE + " L " + pts[0][0] + " " + K.BASE + " Z";
    if (o.area === "gradient")
      K.vec(pl, "area", d, { fill: { kind: "linear", from: [0, 0], to: [0, 1], stops: [{ pos: 0, tok: "data/area-top" }, { pos: 1, tok: "data/area-bottom" }] } }).motion = { kind: "reveal", order: 0 };
    else K.vec(pl, "area", d, { fill: "data/primary", opacity: 0.12 }).motion = { kind: "reveal", order: 0 };
  }
  K.vec(pl, "line", K.path(pts, o.smooth), { stroke: "data/primary", sw: 2 }).motion = { kind: "draw", order: 0 };
  const dots = o.dots === "all" ? pts.map((_, i) => i) : o.dots ?? [];
  for (const i of dots) K.ring(pl, "point " + String(i + 1).padStart(2, "0"), pts[i][0], pts[i][1], 6, "data/primary").motion = { kind: "pop", order: i, after: true };
  if (o.end) {
    const [x, y] = pts[n - 1];
    const h = K.dot(pl, 14, "data/primary", "end point · halo"); h.x = x - 7; h.y = y - 7; h.opacity = 0.25;
    const e = K.dot(pl, 6, "data/primary-soft", "end point"); e.x = x - 3; e.y = y - 3;
    h.motion = { kind: "pop", order: n, after: true }; e.motion = { kind: "pop", order: n, after: true };
  }
  if (o.tip) {
    const [x, y] = pts[o.tip.i];
    const tp = K.AL(pl, "tooltip", "HORIZONTAL", { pl: 8, pr: 8, cross: "CENTER" });
    K.fixH(tp, 24); tp.fill = { tok: "surface/inverse" }; tp.radius = 6;
    text(tp, "Label/S", o.tip.text, { tok: "text/inverse" });
    layout(tp);
    tp.x = Math.round(x - tp.w / 2); tp.y = y - 34;
  }
  for (const [i, t] of Object.entries(o.xl)) {
    const k = +i;
    K.xAt(pl, t, pts[k][0], K.PH - 14, k === 0 ? "start" : k === n - 1 ? "end" : "center");
  }
  return pl;
}
