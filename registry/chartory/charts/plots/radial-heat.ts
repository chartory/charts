// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.radialHeat (Figma ember-chart-4.js, type 52): 7 day rings × 24 hour sectors on the sequential ramp (Monday
// inside), hour labels at 00 / 06 / 12 / 18, a centred caption and the side list (C.sideList).
import { arc, ctr, P, place, seq, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type RadialHeatData = { vals: number[][]; center: [StyleName, string, string][]; rows: Row[] };

export function radialHeat(K: Kit, p: Frame, w: number, o: RadialHeatData): Frame {
  const pl = K.plot(p, "radial heatmap", w, K.PH);
  const R = Math.floor((K.PH - 12) / 2) - 14, cx = 22 + R, cy = Math.floor(K.PH / 2), r0 = Math.round(R * 0.34), ring = (R - r0) / 7;
  for (let d = 0; d < 7; d++) {
    const rin = r0 + d * ring, rout = rin + ring - 1.5;
    for (let h = 0; h < 24; h++) {
      const a0 = -Math.PI / 2 + (h * Math.PI) / 12 + 0.012;
      // cells fade around the clock from 00:00, inner day first (no sweep kind yet)
      arc(K, pl, "cell · d" + d + " h" + h, cx, cy, rout, rin / rout, a0, a0 + Math.PI / 12 - 0.024, seq(o.vals[d][h])).motion = { kind: "fade", order: h + d, group: d * 24 + h };
    }
  }
  for (const [h, t] of [[0, "00"], [6, "06"], [12, "12"], [18, "18"]] as const) {
    const [x, y] = P(cx, cy, R + 9, -Math.PI / 2 + (h * Math.PI) / 12);
    const tt = K.caps(pl, t, "axis");
    tt.name = "hour · " + t;
    place(tt, x - Math.ceil(tt.w) / 2, y - 7);
  }
  const c = ctr(K, pl, "centre", o.center, 0);
  place(c, cx - c.w / 2, cy - c.h / 2);
  K.sideList(pl, cx + R + 30, w - (cx + R + 30), o.rows);
  return pl;
}
