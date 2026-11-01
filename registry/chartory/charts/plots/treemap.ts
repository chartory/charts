// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.treemap (Figma ember-chart.js): grouped treemap; groups squarified by total, items squarified inside their group,
// shaded by rank (1, 0.82, 0.68 …). C.tile is ported here: a 1 px inset tile with radius 3, a label when it fits and
// a value under it when the tile is tall enough.
import { squarify, type Kit } from "../core/kit";
import { remove, type Frame } from "../core/node";

export type TreemapData = { groups: { name: string; tok: string; items: [string, number][] }[]; fmt?: (v: number) => string };

type R = { x: number; y: number; w: number; h: number };

/** C.tile: nothing is drawn when the tile is under 2 px after the inset. */
export function tile(K: Kit, pl: Frame, name: string, r: R, tok: string, op: number | null, label: string, sub: string | null, subTok: string | undefined, order: number): void {
  const x0 = Math.round(r.x), y0 = Math.round(r.y), x1 = Math.round(r.x + r.w), y1 = Math.round(r.y + r.h);
  const w = x1 - x0 - 2, h = y1 - y0 - 2;
  if (w < 2 || h < 2) return;
  const b = K.rect(pl, "tile · " + name, x0 + 1, y0 + 1, w, h, tok, 3);
  if (op != null && op < 1) b.opacity = op;
  b.motion = { kind: "fade", order, group: order };
  if (w >= 48 && h >= 22) {
    const t = K.T(pl, "Label/S", label, "strong");
    if (Math.ceil(t.w) + 12 > w) { remove(t); return; }
    t.x = x0 + 7; t.y = y0 + 6; t.name = "label · " + name;
    t.motion = { kind: "fade", order, group: order, after: true };
    if (sub && h >= 38) {
      const s = K.caps(pl, sub, subTok ?? "strong");
      if (Math.ceil(s.w) + 12 <= w) { s.x = x0 + 7; s.y = y0 + 22; s.motion = { kind: "fade", order, group: order, after: true }; } else remove(s);
    }
  }
}

export function treemap(K: Kit, p: Frame, w: number, o: TreemapData): Frame {
  const pl = K.plot(p, "treemap", w, K.PH);
  const sum = (g: TreemapData["groups"][number]) => g.items.reduce((s, i) => s + i[1], 0);
  const G = [...o.groups].sort((a, b) => sum(b) - sum(a));
  const gr = squarify(G.map(sum), 0, 0, w, K.PH);
  const shade = [1, 0.82, 0.68, 0.56, 0.46, 0.4];
  let order = 0;
  for (let gi = 0; gi < G.length; gi++) {
    const g = G[gi];
    const it = [...g.items].sort((a, b) => b[1] - a[1]);
    const rr = squarify(it.map((i) => i[1]), gr[gi].x, gr[gi].y, gr[gi].w, gr[gi].h);
    for (let k = 0; k < it.length; k++) tile(K, pl, it[k][0].toLowerCase(), rr[k], g.tok, shade[k] ?? 0.4, it[k][0], o.fmt ? o.fmt(it[k][1]) : null, undefined, order++);
  }
  return pl;
}
