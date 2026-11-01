// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.volumeProfile (Figma ember-chart-4.js): price line over a y grid, volume per price level as bars from the right
// edge (point of control primary, value area primary-soft, the rest track), a dashed line and chip at the POC.
import { X, chip, dash, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type VolumeProfileData = {
  price: number[]; vol: number[]; min: number; max: number; ticks: string[];
  poc: number; va: [number, number]; xl: Record<number, string>; pocText?: string;
};

export function volumeProfile(K: Kit, p: Frame, w: number, o: VolumeProfileData): Frame {
  const pl = K.plot(p, "volume profile", w, K.PH);
  const yW = 44;
  K.yGrid(pl, o.ticks, yW, w);
  const nb = o.vol.length, bh = (K.BASE - K.TOP) / nb, vm = Math.max(...o.vol), pw = Math.round((w - yW) * 0.42);
  for (let b = 0; b < nb; b++) {
    const y = Math.round(K.BASE - (b + 1) * bh) + 1, h = Math.round(K.BASE - b * bh) - y - 1;
    const len = Math.max(2, Math.round((o.vol[b] / vm) * pw));
    const tok = b === o.poc ? "data/primary" : b >= o.va[0] && b <= o.va[1] ? "data/primary-soft" : "data/track";
    // levels grow from the right edge, bottom to top
    K.rect(pl, "level " + (b + 1), w - len, y, len, h, tok, 1).motion = { kind: "grow", origin: "right", order: b };
  }
  const n = o.price.length, x1 = w - pw - 12;
  const pts = o.price.map((v, i): [number, number] => [X(i, n, yW + 4, x1), K.yMap(v, o.min, o.max)]);
  K.vec(pl, "price", K.path(pts), { stroke: "data/cat-2", sw: 1.5 }).motion = { kind: "draw", order: 0 };
  const py = Math.round(K.BASE - (o.poc + 0.5) * bh);
  dash(K, pl, "poc line", "M " + yW + " " + py + " L " + w + " " + py, "data/primary");
  if (o.pocText) { const c = chip(K, pl, o.pocText, "neutral", 0, 0); place(c, yW + 6, py - c.h - 3); }
  for (const [i, t] of Object.entries(o.xl)) { const kk = +i; K.xAt(pl, t, pts[kk][0], K.PH - 14, kk === 0 ? "start" : "center"); }
  return pl;
}
