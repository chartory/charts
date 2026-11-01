// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.splitCal (Figma ember-chart-5.js, type 100): a month calendar (Monday first) whose day cells split on the diagonal:
// cash in as the upper-left triangle (status/success), cash out as the lower-right (status/danger), each at
// 0.2 + 0.8 × value / max; weekday letters on top, the side list (C.sideList) beside it.
import { box, cell, tri, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";

export type SplitCalData = { days: [number, number][]; start: number; max: number; rows: Row[] };

export function splitCal(K: Kit, p: Frame, w: number, o: SplitCalData): Frame {
  const pl = K.plot(p, "split calendar", w, K.PH);
  const cs = Math.floor((K.PH - 20) / 6), g = 3, wd = ["M", "T", "W", "T", "F", "S", "S"];
  for (let d = 0; d < 7; d++) cell(K, pl, wd[d], d * cs, 0, cs - g, "Label/Caps", "axis");
  o.days.forEach(([vin, vout], i) => {
    const pos = i + o.start, col = pos % 7, row = Math.floor(pos / 7);
    const x = col * cs, y = 18 + row * cs, s = cs - g;
    box(K, pl, "day " + (i + 1), x, y, s, s, "chipFill", 3, 0.6);
    const mo = { kind: "fade" as const, order: row + col, group: i };
    if (vin) tri(K, pl, "in", [[x, y], [x + s, y], [x, y + s]], "status/success", 0.2 + (0.8 * vin) / o.max).motion = mo;
    if (vout) tri(K, pl, "out", [[x + s, y], [x + s, y + s], [x, y + s]], "status/danger", 0.2 + (0.8 * vout) / o.max).motion = { ...mo };
  });
  K.sideList(pl, 7 * cs + 24, w - (7 * cs + 24), o.rows);
  return pl;
}
