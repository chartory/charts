// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.ridgeline (Figma ember-chart-4.js, type 55): one smoothed density per row (sum of weighted Gaussians, scaled to
// its own peak), each masked by the ground so the rows overlap cleanly, with the name on the left.
import { place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type RidgelineData = { rows: { label: string; tok: string; peaks: [number, number, number][] }[]; max: number; xt: [number, string][] };

export function ridgeline(K: Kit, p: Frame, w: number, o: RidgelineData): Frame {
  const pl = K.plot(p, "ridgeline", w, K.PH);
  const lW = 72, k = o.rows.length, base0 = 52, step = Math.floor((K.PH - 22 - base0) / (k - 1)), amp = 44;
  const x = (v: number) => lW + Math.round((v / o.max) * (w - lW));
  for (let r = 0; r < k; r++) {
    const row = o.rows[r];
    const yb = base0 + r * step;
    const N = 64;
    const ds = Array.from({ length: N + 1 }, (_, i) => { const v = (i / N) * o.max; return row.peaks.reduce((a, [m, s, wt]) => a + wt * Math.exp(-((v - m) ** 2) / (2 * s * s)), 0); });
    const dm = Math.max(...ds);
    const pts = ds.map((d, i) => [lW + Math.round((i / N) * (w - lW)), +(yb - (d / dm) * amp).toFixed(2)] as [number, number]);
    const area = K.path(pts, true) + " L " + w + " " + yb + " L " + lW + " " + yb + " Z";
    const nm = row.label.toLowerCase();
    // a row wipes in left to right (its mask with it), rows top to bottom
    K.vec(pl, "mask · " + nm, area, { fill: K.BG }).motion = { kind: "reveal", order: r, group: r };
    K.vec(pl, "area · " + nm, area, { fill: row.tok, opacity: 0.3 }).motion = { kind: "reveal", order: r, group: r };
    K.vec(pl, "line · " + nm, K.path(pts, true), { stroke: row.tok, sw: 1.5 }).motion = { kind: "draw", order: r, group: r };
    K.rect(pl, "base · " + nm, lW, yb, w - lW, 1, "grid");
    const lb = K.caps(pl, row.label, "body");
    lb.name = "model · " + nm;
    place(lb, 0, yb - 12);
  }
  for (const [v, t] of o.xt) K.xAt(pl, t, x(v), K.PH - 14, v === 0 ? "start" : v === o.max ? "end" : "center");
  return pl;
}
