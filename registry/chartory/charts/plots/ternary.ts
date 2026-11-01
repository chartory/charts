// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.ternary (Figma ember-chart-5.js, type 95): a ternary plot. Equilateral triangle (top / left / right corners) with a
// soft area, grid lines at every fifth on all three axes, a frame, one sized dot per item with its name, corner names.
import { place, tri, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type TernaryData = {
  corners: [string, string, string];
  /** a = top share, b = left, c = right */
  pts: { label: string; a: number; b: number; c: number; r: number; tok: string }[];
};

export function ternary(K: Kit, p: Frame, w: number, o: TernaryData): Frame {
  const pl = K.plot(p, "ternary", w, K.PH);
  const H = K.PH - 44, side = Math.round((H * 2) / Math.sqrt(3)), x0 = Math.round((w - side) / 2), yb = 22 + H;
  const T: [number, number] = [x0 + side / 2, 22], L: [number, number] = [x0, yb], Rr: [number, number] = [x0 + side, yb];
  const at = (a: number, b: number, c: number): [number, number] => [+(a * T[0] + b * L[0] + c * Rr[0]).toFixed(2), +(a * T[1] + b * L[1] + c * Rr[1]).toFixed(2)];
  tri(K, pl, "area", [T, L, Rr], "chipFill", 0.6);
  for (let k = 1; k < 5; k++) {
    const f = k / 5;
    for (const [p1, p2] of [[at(f, 1 - f, 0), at(f, 0, 1 - f)], [at(0, f, 1 - f), at(1 - f, f, 0)], [at(1 - f, 0, f), at(0, 1 - f, f)]])
      K.vec(pl, "grid", "M " + p1.join(" ") + " L " + p2.join(" "), { stroke: "grid", sw: 1 });
  }
  K.vec(pl, "frame", K.path([T, L, Rr]) + " Z", { stroke: "body", sw: 1 });
  o.pts.forEach((q, i) => {
    const [x, y] = at(q.a, q.b, q.c);
    const d = K.dot(pl, 2 * q.r, q.tok, "model · " + q.label.toLowerCase());
    d.x = Math.round(x - q.r); d.y = Math.round(y - q.r); d.opacity = 0.9;
    d.motion = { kind: "pop", order: i, group: i };
    const t = K.caps(pl, q.label, "strong");
    place(t, x + q.r + 4, y - 7);
    t.motion = { kind: "fade", order: i, group: i, after: true };
  });
  const ct = K.caps(pl, o.corners[0], "body");
  place(ct, T[0] - Math.ceil(ct.w) / 2, 2);
  const cl = K.caps(pl, o.corners[1], "body");
  place(cl, x0 - 8 - Math.ceil(cl.w) < 0 ? 0 : x0 - Math.ceil(cl.w) / 2, yb + 6);
  const cr = K.caps(pl, o.corners[2], "body");
  place(cr, Math.min(w - Math.ceil(cr.w), x0 + side - Math.ceil(cr.w) / 2), yb + 6);
  return pl;
}
