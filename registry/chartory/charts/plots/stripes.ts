// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.stripes (Figma ember-chart-5.js, type 90): one full-height stripe per day, data/primary when the rate is ≥ 0,
// cat-2 below, opacity by |rate| / max; the price as a smooth line over the stripes; date labels under them.
import { box, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type StripesData = { vals: number[]; price: number[]; max: number; xl: Record<number, string> };

export function stripes(K: Kit, p: Frame, w: number, o: StripesData): Frame {
  const pl = K.plot(p, "stripes", w, K.PH);
  const n = o.vals.length, sw = w / n, top = 0, bottom = K.PH - 22;
  for (let i = 0; i < n; i++) {
    const v = o.vals[i];
    const x0 = Math.round(i * sw), x1 = Math.round((i + 1) * sw);
    box(K, pl, "day " + (i + 1), x0, top, x1 - x0, bottom - top, v >= 0 ? "data/primary" : "data/cat-2", 0, 0.15 + 0.85 * Math.min(1, Math.abs(v) / o.max)).motion = { kind: "fade", order: i };
  }
  const pm = Math.min(...o.price), px = Math.max(...o.price);
  const pts = o.price.map((v, i): [number, number] => [Math.round((i + 0.5) * sw), +(bottom - 14 - ((v - pm) / (px - pm)) * (bottom - 34)).toFixed(2)]);
  K.vec(pl, "price", K.path(pts, true), { stroke: "strong", sw: 1.5 }).motion = { kind: "draw", order: n };
  for (const [i, t] of Object.entries(o.xl)) {
    const kk = +i;
    K.xAt(pl, t, kk === 0 ? 0 : kk === n - 1 ? w : Math.round((kk + 0.5) * sw), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center");
  }
  return pl;
}
