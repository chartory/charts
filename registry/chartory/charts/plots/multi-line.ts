// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.multiLine (Figma ember-chart-2.js): several smooth lines over a y grid, optionally with a translucent area under
// each (overlapping areas), x labels at chosen points (first starts, last ends, others centre).
import { type Kit, X } from "../core/kit";
import { collection, type Frame } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type MultiLineData = {
  min: number; max: number; ticks: string[]; xl: Record<number, string>;
  series: { name: string; tok: string; vals: number[] }[];
  /** area opacity under each line (none when absent) */
  area?: number; sw?: number;
};

export function multiLine(K: Kit, p: Frame, w: number, o: MultiLineData): Frame {
  if (collection.signal) return signalPlot("multi-line")(K, p, w, o); // Signal: charts/signal/plots/multi-line.ts (@chartory/signal)
  const pl = K.plot(p, "multi line", w, K.PH);
  const yW = 36;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.series[0].vals.length;
  o.series.forEach((s, si) => {
    const pts = s.vals.map((v, i) => [X(i, n, yW, w), K.yMap(v, o.min, o.max)] as [number, number]);
    if (o.area)
      K.vec(pl, "area · " + s.name, K.path(pts, true) + " L " + pts[n - 1][0] + " " + K.BASE + " L " + pts[0][0] + " " + K.BASE + " Z", { fill: s.tok, opacity: o.area }).motion = { kind: "reveal", order: si, group: si };
    K.vec(pl, "line · " + s.name, K.path(pts, true), { stroke: s.tok, sw: o.sw ?? 2 }).motion = { kind: "draw", order: si, group: si };
  });
  for (const [i, t] of Object.entries(o.xl)) {
    const k = +i;
    K.xAt(pl, t, X(k, n, yW, w), K.PH - 14, k === 0 ? "start" : k === n - 1 ? "end" : "center");
  }
  return pl;
}
