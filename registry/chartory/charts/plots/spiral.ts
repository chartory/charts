// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.spiral (Figma ember-chart-4.js, type 51): a year of weekly values as dots on an Archimedean spiral (size and
// sequential colour by value), the busiest week ringed, a centred caption and the side list (C.sideList).
import { ctr, P, place, point, seq, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type SpiralData = { vals: number[]; turns?: number; center: [StyleName, string, string][]; rows: Row[] };

export function spiral(K: Kit, p: Frame, w: number, o: SpiralData): Frame {
  const pl = K.plot(p, "spiral", w, K.PH);
  const R = Math.floor((K.PH - 12) / 2), cx = 8 + R, cy = Math.floor(K.PH / 2), r0 = 22, n = o.vals.length, T = o.turns ?? 2.5;
  const pos = (t: number) => P(cx, cy, r0 + (R - 8 - r0) * t, -Math.PI / 2 + t * T * 2 * Math.PI);
  K.vec(pl, "guide", K.path(Array.from({ length: 161 }, (_, i) => pos(i / 160))), { stroke: "grid", sw: 1 });
  const mx = o.vals.indexOf(Math.max(...o.vals));
  for (let i = 0; i < n; i++) {
    const v = o.vals[i];
    const [x, y] = pos(i / (n - 1));
    const s = 4 + 2 * Math.round(v * 3);
    const d = K.dot(pl, s, seq(v), "week " + (i + 1));
    d.x = Math.round(x - s / 2); d.y = Math.round(y - s / 2);
    // weeks pop along the spiral, first week first
    d.motion = { kind: "pop", order: i, group: i };
    if (i === mx) point(K, pl, "peak", Math.round(x), Math.round(y), s + 8, "strong").motion = { kind: "pop", order: i, group: i, after: true };
  }
  const c = ctr(K, pl, "centre", o.center);
  place(c, cx - c.w / 2, cy - c.h / 2);
  K.sideList(pl, cx + R + 32, w - (cx + R + 32), o.rows);
  return pl;
}
