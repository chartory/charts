// C.band (Figma ember-chart-2.js): a confidence band (p10–p90) behind a line that is solid up to today (actual) and
// dashed after it (forecast), a "today" rule and a ringed point on it.
import { X, tail, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type BandData = { mid: number[]; hi: number[]; lo: number[]; split: number; min: number; max: number; ticks: string[]; xl: Record<number, string> };

export function band(K: Kit, p: Frame, w: number, o: BandData): Frame {
  const pl = K.plot(p, "band and line", w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.mid.length;
  const Y = (v: number) => K.yMap(v, o.min, o.max);
  const hi = o.hi.map((v, i) => [X(i, n, yW, w), Y(v)] as [number, number]);
  const lo = o.lo.map((v, i) => [X(i, n, yW, w), Y(v)] as [number, number]).reverse();
  K.vec(pl, "band · p10–p90", K.path(hi, true) + " L " + lo[0][0] + " " + lo[0][1] + tail(K, lo) + " Z", { fill: "data/primary", opacity: 0.18 }).motion = { kind: "reveal", order: 0 };
  const pts = o.mid.map((v, i) => [X(i, n, yW, w), Y(v)] as [number, number]);
  K.vec(pl, "actual", K.path(pts.slice(0, o.split + 1), true), { stroke: "data/primary", sw: 2 }).motion = { kind: "draw", order: 0 };
  const f = K.vec(pl, "forecast", K.path(pts.slice(o.split), true), { stroke: "data/primary-soft", sw: 2 });
  f.dash = [4, 4];
  f.motion = { kind: "draw", order: 1 };
  const [tx, ty] = pts[o.split];
  const nl = K.rect(pl, "today", tx, K.TOP, 1, K.BASE - K.TOP, "text/strong"); nl.opacity = 0.35;
  K.ring(pl, "today point", tx, ty, 8, "data/primary").motion = { kind: "pop", order: 1, after: true };
  for (const [i, t] of Object.entries(o.xl)) {
    const k = +i;
    K.xAt(pl, t, X(k, n, yW, w), K.PH - 14, k === 0 ? "start" : k === n - 1 ? "end" : "center");
  }
  return pl;
}
