// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.profile (Figma ember-chart-2.js): vertical profile; categories down the y axis (one grid row each), the value on
// x, each series a smooth line through ringed points.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ProfileData = { rows: string[]; min: number; max: number; xt: [number, string][]; series: { name: string; tok: string; vals: number[] }[] };

export function profile(K: Kit, p: Frame, w: number, o: ProfileData): Frame {
  const pl = K.plot(p, "profile", w, K.PH);
  const yW = 48, base = K.PH - 22, n = o.rows.length;
  const Yr = (i: number) => Math.round(8 + (i * (base - 16)) / (n - 1));
  const Xv = (v: number) => yW + Math.round(((v - o.min) / (o.max - o.min)) * (w - yW - 8));
  for (let i = 0; i < n; i++) {
    K.rect(pl, "grid " + o.rows[i], yW, Yr(i), w - yW, 1, "grid");
    const t = K.caps(pl, o.rows[i], "axis");
    t.x = yW - 8 - Math.ceil(t.w); t.y = Yr(i) - 7;
  }
  for (const [v, tx] of o.xt) K.xAt(pl, tx, Xv(v), K.PH - 14, "center");
  o.series.forEach((s, si) => {
    const pts = s.vals.map((v, i) => [Xv(v), Yr(i)] as [number, number]);
    K.vec(pl, "profile · " + s.name, K.path(pts, true), { stroke: s.tok, sw: 2 }).motion = { kind: "draw", order: si, group: si };
    pts.forEach(([x, y], i) => { K.ring(pl, "point", x, y, 6, s.tok).motion = { kind: "pop", order: i, group: si, after: true }; });
  });
  return pl;
}
