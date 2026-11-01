// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.underwater (Figma ember-chart-4.js): drawdown from the running peak below a 0 line: a danger area at 0.2 under
// a 1.5 px line, the deepest point ringed with a danger chip beside it, x labels at chosen points.
import { chip, place, point, X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type UnderwaterData = { vals: number[]; min: number; ticks: string[]; xl: Record<number, string>; mark: { i: number; text: string } };

export function underwater(K: Kit, p: Frame, w: number, o: UnderwaterData): Frame {
  const pl = K.plot(p, "underwater", w, K.PH);
  const yW = 44;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.vals.length;
  const pts = o.vals.map((v, i) => [X(i, n, yW, w), K.yMap(v, o.min, 0)] as [number, number]);
  const y0 = K.yMap(0, o.min, 0);
  K.vec(pl, "drawdown area", K.path(pts) + " L " + w + " " + y0 + " L " + yW + " " + y0 + " Z", { fill: "status/danger", opacity: 0.2 }).motion = { kind: "reveal", order: 0 };
  K.vec(pl, "drawdown line", K.path(pts), { stroke: "status/danger", sw: 1.5 }).motion = { kind: "draw", order: 0 };
  const [mx, my] = pts[o.mark.i];
  point(K, pl, "max drawdown", mx, my, 10, "status/danger").motion = { kind: "pop", order: 1, group: 1, after: true };
  const c = chip(K, pl, o.mark.text, "danger", 0, 0);
  place(c, mx + 10, my - c.h / 2);
  c.motion = { kind: "fade", order: 1, group: 1, after: true };
  for (const [i, t] of Object.entries(o.xl)) {
    const kk = +i;
    K.xAt(pl, t, X(kk, n, yW, w), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center");
  }
  return pl;
}
