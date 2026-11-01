// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.ciDots (Figma ember-chart-3.js): dot plot with confidence intervals; a row per item (name at the left), the
// interval as a 2 px bar with end caps and the estimate as a ringed dot, coloured by where the interval sits against
// the dashed target (green above, red below, amber across); vertical grid with ticks under the rows.
import { dash, paint, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type CiDotsData = { min: number; max: number; target: number; ticks: [number, string][]; rows: { label: string; v: number; lo: number; hi: number }[] };

export function ciDots(K: Kit, p: Frame, w: number, o: CiDotsData): Frame {
  const pl = K.plot(p, "confidence dots", w, K.PH);
  const lW = 92, x = (v: number) => lW + Math.round(((v - o.min) / (o.max - o.min)) * (w - lW - 1));
  const n = o.rows.length, rh = Math.floor((K.BASE - K.TOP + 8) / n);
  for (const [v, t] of o.ticks) {
    K.rect(pl, "grid · " + t, x(v), K.TOP - 4, 1, n * rh, "grid");
    K.xAt(pl, t, x(v), K.PH - 14, v === o.max ? "end" : "center");
  }
  const tg = x(o.target);
  dash(K, pl, "target", "M " + tg + " " + (K.TOP - 4) + " L " + tg + " " + (K.TOP - 4 + n * rh), "body");
  for (let i = 0; i < n; i++) {
    const r = o.rows[i], cy = K.TOP - 4 + i * rh + Math.round(rh / 2), nm = r.label.toLowerCase();
    const t = r.lo >= o.target ? "status/success" : r.hi < o.target ? "status/danger" : "status/warning";
    const lb = K.T(pl, "Body/S", r.label, "strong");
    lb.name = "name · " + nm; lb.x = 0; lb.y = cy - Math.round(lb.h / 2);
    K.rect(pl, "interval · " + nm, x(r.lo), cy - 1, x(r.hi) - x(r.lo), 2, t, 1).motion = { kind: "reveal", order: i, group: i };
    for (const v of [r.lo, r.hi]) K.rect(pl, "cap", x(v), cy - 4, 1, 8, t).motion = { kind: "fade", order: i, group: i };
    const d = K.dot(pl, 10, t, "estimate · " + nm);
    d.x = x(r.v) - 5; d.y = cy - 5; d.stroke = paint(K.BG); d.sw = 2; d.align = "outside";
    d.motion = { kind: "pop", order: i, group: i, after: true };
  }
  return pl;
}
