// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.punchCard (Figma ember-chart-5.js, type 86): days × 24 hours, a dot per hour sized by its share of the busiest
// hour (data/primary above 75 %, else primary-soft), a grid line through each row, day labels left, hour labels.
import { place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type PunchCardData = { rows: string[]; vals: number[][]; xl: Record<number, string> };

export function punchCard(K: Kit, p: Frame, w: number, o: PunchCardData): Frame {
  const pl = K.plot(p, "punch card", w, K.PH);
  const lW = 40, n = 24, cw = Math.floor((w - lW) / n), k = o.rows.length, rh = Math.floor((K.PH - 22) / k);
  const mx = Math.max(...o.vals.flat());
  for (let r = 0; r < k; r++) {
    const t = K.caps(pl, o.rows[r], "body");
    place(t, 0, r * rh + rh / 2 - 7);
    K.rect(pl, "row line", lW, r * rh + Math.round(rh / 2), w - lW, 1, "grid");
    for (let h = 0; h < n; h++) {
      const v = o.vals[r][h];
      if (!v) continue;
      const d = Math.max(2, 2 * Math.round(((v / mx) * (Math.min(cw, rh) - 4)) / 2));
      const e = K.dot(pl, d, v / mx > 0.75 ? "data/primary" : "data/primary-soft", "punch");
      e.x = lW + h * cw + Math.round((cw - d) / 2); e.y = r * rh + Math.round((rh - d) / 2);
      e.motion = { kind: "pop", order: h + r, group: r };
    }
  }
  for (const [h, t] of Object.entries(o.xl)) K.xAt(pl, t, lW + +h * cw + Math.round(cw / 2), K.PH - 14, "center");
  return pl;
}
