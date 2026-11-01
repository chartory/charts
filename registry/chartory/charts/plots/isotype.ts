// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.isotype (Figma ember-chart-5.js, type 97): one row of parcel icons per category, one icon per unit (the last one
// cut to its share), a tape stripe on whole parcels when they are 10 px or more, the name left and the total right.
import { box, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type IsotypeData = { unit: number; rows: { label: string; v: number; tok: string }[] };

export function isotype(K: Kit, p: Frame, w: number, o: IsotypeData): Frame {
  const pl = K.plot(p, "isotype", w, K.PH);
  const lW = 84, rW = 52, k = o.rows.length, rh = Math.floor((K.PH - 4) / k);
  const maxU = Math.max(...o.rows.map((r) => Math.ceil(r.v / o.unit)));
  const stp = Math.min(16, Math.floor((w - lW - rW) / maxU)), gap = stp >= 12 ? 4 : 2, gs = stp - gap;
  for (let r = 0; r < k; r++) {
    const q = o.rows[r];
    const y = r * rh + Math.round((rh - gs) / 2);
    const lb = K.T(pl, "Body/S", q.label, "strong");
    place(lb, 0, y + gs / 2 - lb.h / 2);
    const units = q.v / o.unit;
    for (let i = 0; i < Math.ceil(units); i++) {
      const x = lW + i * (gs + gap);
      const f = Math.min(1, units - i);
      const g = box(K, pl, "parcel", x, y, gs, gs, q.tok, 3);
      if (f < 1) g.w = Math.max(3, Math.round(gs * f));
      g.motion = { kind: "fade", order: r + i, group: r };
      if (f >= 1 && gs >= 10) box(K, pl, "tape", x + Math.floor(gs / 2) - 1, y, 2, Math.round(gs * 0.45), "field", 0).motion = { kind: "fade", order: r + i, group: r };
    }
    const c = K.caps(pl, K.num(q.v), "strong");
    place(c, w - Math.ceil(c.w), y + gs / 2 - 7);
    c.motion = { kind: "fade", order: r + Math.ceil(q.v / o.unit), group: r, after: true };
  }
  return pl;
}
