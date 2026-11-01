// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.shelf (Figma ember-chart-4.js, type 59): a planogram, one row of facings per shelf (width by facings), each
// outlined with its stock level as a fill from the bottom (healthy data/primary 75 %, low status/warning, out a
// status/danger wash), the name on facings 44 px and wider, and the shelf board under the row.
import { cell, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ShelfData = { shelves: { name: string; w: number; pct: number }[][]; low: number; out: number };

export function shelf(K: Kit, p: Frame, w: number, o: ShelfData): Frame {
  const pl = K.plot(p, "shelf", w, K.PH);
  const h = 40;
  let order = 0;
  for (let s = 0; s < o.shelves.length; s++) {
    const y = 4 + s * 52;
    let x = 0;
    const row = o.shelves[s];
    const tot = row.reduce((a, q) => a + q.w, 0);
    const g = 4;
    const unit = (w - g * (row.length - 1)) / tot;
    for (let i = 0; i < row.length; i++) {
      const q = row[i];
      const bw = i === row.length - 1 ? w - x : Math.round(q.w * unit);
      const bx = K.rect(pl, "facing · " + q.name.toLowerCase(), x, y, bw, h, null, 4);
      bx.stroke = { tok: "chip/stroke" }; bx.sw = 1; bx.align = "inside";
      // facings fade in reading order, the stock rises in each
      bx.motion = { kind: "fade", order, group: order };
      const tok = q.pct <= o.out ? "status/danger" : q.pct <= o.low ? "status/warning" : "data/primary";
      const fh = Math.max(q.pct <= o.out ? 0 : 3, Math.round((h - 24) * q.pct));
      if (fh) {
        const f = K.rect(pl, "stock", x + 2, y + h - 2 - fh, bw - 4, fh, tok, 2);
        f.opacity = q.pct <= o.low ? 1 : 0.75;
        f.motion = { kind: "grow", origin: "bottom", order, group: order };
      }
      if (q.pct <= o.out) {
        const ob = K.rect(pl, "out", x + 2, y + 2, bw - 4, h - 4, "status/danger", 2);
        ob.opacity = 0.14;
        ob.motion = { kind: "fade", order, group: order };
      }
      if (bw >= 44) cell(K, pl, q.name, x, y + 4, bw, "Label/Caps", "strong").motion = { kind: "fade", order, group: order, after: true };
      x += bw + g;
      order++;
    }
    K.rect(pl, "shelf " + (s + 1), 0, y + h + 3, w, 2, "body");
  }
  return pl;
}
