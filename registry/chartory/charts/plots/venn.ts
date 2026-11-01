// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.venn (Figma ember-chart-4.js): three overlapping set circles (fill at 28 % + a 1.5 px outline), a count centred
// in each of the seven regions, and the set list beside it (C.sideList); compact (× 0.84) when the list is narrow.
import { ctr, paint, place, type Kit, type Row } from "../core/kit";
import { ellipse, type Frame } from "../core/node";

export type VennData = {
  sets: { label: string; tok: string }[];
  regions: { a: string; b: string; c: string; ab: string; ac: string; bc: string; abc: string };
  rows: Row[];
};

export function venn(K: Kit, p: Frame, w: number, o: VennData): Frame {
  const pl = K.plot(p, "venn", w, K.PH);
  const nar = w - 196 < 112, k = nar ? 0.84 : 1;
  const r = Math.round(52 * k), cx = nar ? 70 : 84, cy = Math.floor(K.PH / 2) - 2;
  const q = (v: number) => Math.round(v * k);
  const cs = [[cx - q(28), cy - q(18)], [cx + q(28), cy - q(18)], [cx, cy + q(28)]];
  cs.forEach(([x, y], i) => {
    const e = ellipse(pl, "set · " + o.sets[i].label.toLowerCase(), x - r, y - r, 2 * r, 2 * r, { fill: paint(o.sets[i].tok) });
    e.opacity = 0.28;
    e.motion = { kind: "pop", order: i, group: i };
    ellipse(pl, "outline · " + o.sets[i].label.toLowerCase(), x - r, y - r, 2 * r, 2 * r, { stroke: paint(o.sets[i].tok), sw: 1.5, align: "inside" }).motion = { kind: "pop", order: i, group: i };
  });
  const R = o.regions;
  const lab: [string, number, number][] = [[R.a, cx - q(54), cy - q(30)], [R.b, cx + q(54), cy - q(30)], [R.c, cx, cy + q(56)], [R.ab, cx, cy - q(42)], [R.ac, cx - q(30), cy + q(18)], [R.bc, cx + q(30), cy + q(18)], [R.abc, cx, cy - 2]];
  for (const [t, x, y] of lab) {
    const c = ctr(K, pl, "region", [["Label/S", t, "strong"]]);
    place(c, x - c.w / 2, y - c.h / 2);
    for (const ch of c.children) ch.motion = { kind: "fade", order: 3, after: true };
  }
  const lx = nar ? 164 : 196;
  K.sideList(pl, lx, w - lx, o.rows);
  return pl;
}
