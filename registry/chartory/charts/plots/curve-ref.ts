// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.curveRef (Figma ember-chart-4.js, types 60 gains curve and 77 Lorenz curve): a curve against the dashed
// diagonal reference over a 0–1 y grid, the gap between them shaded, a marked point with its guide and chip.
// gains: 1 − (1 − t)^k in data/primary, chip right and below the mark; lorenz: t^k in status/warning, chip left and above.
import { chip, dash, point, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type CurveRefData = { mode: "gains" | "lorenz"; k: number; mark: { x: number; text: string }; ticks: string[]; xt: [number, string][] };

export function curveRef(K: Kit, p: Frame, w: number, o: CurveRefData): Frame {
  const pl = K.plot(p, o.mode, w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const x = (v: number) => yW + Math.round(v * (w - yW)), y = (v: number) => K.yMap(v, 0, 1);
  const f = o.mode === "gains" ? (t: number) => 1 - Math.pow(1 - t, o.k) : (t: number) => Math.pow(t, o.k);
  const tok = o.mode === "gains" ? "data/primary" : "status/warning";
  const N = 40;
  const pts = Array.from({ length: N + 1 }, (_, i) => [x(i / N), +(K.BASE - f(i / N) * (K.BASE - K.TOP)).toFixed(2)] as [number, number]);
  K.vec(pl, "gap area", K.path(pts) + " L " + x(0) + " " + y(0) + " Z", { fill: tok, opacity: 0.14 }).motion = { kind: "reveal", order: 0 };
  dash(K, pl, "reference", "M " + x(0) + " " + y(0) + " L " + x(1) + " " + y(1), "body").motion = { kind: "draw", order: 0 };
  K.vec(pl, "curve", K.path(pts), { stroke: tok, sw: 2 }).motion = { kind: "draw", order: 0 };
  const mx = x(o.mark.x), my = Math.round(K.BASE - f(o.mark.x) * (K.BASE - K.TOP));
  dash(K, pl, "mark guide", "M " + mx + " " + K.BASE + " L " + mx + " " + my, "grid").motion = { kind: "draw", order: 1, after: true };
  point(K, pl, "mark", mx, my, 10, tok).motion = { kind: "pop", order: 1, after: true };
  const c = chip(K, pl, o.mark.text, "neutral", 0, 0);
  c.x = o.mode === "gains" ? mx + 10 : mx - c.w - 10;
  c.y = my + (o.mode === "gains" ? 8 : -9);
  c.motion = { kind: "fade", order: 1, after: true };
  for (const [v, t] of o.xt) K.xAt(pl, t, x(v), K.PH - 14, v === 0 ? "start" : v === 1 ? "end" : "center");
  return pl;
}
