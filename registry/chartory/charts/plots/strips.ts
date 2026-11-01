// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.strips (Figma ember-chart.js): one row per item; a rounded range track from its lowest to its highest point,
// translucent dots sized per point, the low / high values either side; vertical grid lines at the ticks.
import type { Kit } from "../core/kit";
import { ellipse, type Frame } from "../core/node";

export type StripsData = { rows: { label: string; pts: [number, number][] }[]; min: number; max: number; ticks: [number, string][]; fmt: (v: number) => string; yW?: number };

export function strips(K: Kit, p: Frame, w: number, o: StripsData): Frame {
  const pl = K.plot(p, "range strips", w, K.PH);
  const yW = o.yW ?? 96, n = o.rows.length, base = K.PH - 22;
  const rh = Math.floor(base / n);
  const X = (v: number) => yW + Math.round(((v - o.min) / (o.max - o.min)) * (w - yW - 36));
  for (const [v, t] of o.ticks) {
    K.rect(pl, "grid · " + t.toLowerCase(), X(v), 0, 1, base, "grid");
    K.xAt(pl, t, X(v), K.PH - 14, "center");
  }
  let order = 0;
  for (let i = 0; i < n; i++) {
    const r = o.rows[i], cy = i * rh + Math.floor(rh / 2);
    const t = K.T(pl, "Label/S", r.label, "strong"); t.x = 0; t.y = cy - Math.round(t.h / 2);
    const vs = r.pts.map((q) => q[0]);
    const lo = Math.min(...vs), hi = Math.max(...vs);
    K.rect(pl, "range · " + r.label.toLowerCase(), X(lo) - 9, cy - 9, X(hi) - X(lo) + 18, 18, "data/track", 9).motion = { kind: "reveal", order: i, group: i };
    for (const [v, d] of r.pts) {
      const e = ellipse(pl, "point", X(v) - d / 2, cy - d / 2, d, d, { fill: { tok: "data/primary" }, stroke: { tok: "data/primary-soft" }, sw: 1, align: "inside" });
      e.opacity = 0.55;
      e.motion = { kind: "pop", order: order++, group: i, after: true };
    }
    const a = K.caps(pl, o.fmt(lo), "axis"); a.x = X(lo) - 14 - Math.ceil(a.w); a.y = cy - 7;
    const b = K.caps(pl, o.fmt(hi), "axis"); b.x = X(hi) + 14; b.y = cy - 7;
    a.motion = { kind: "fade", order: i, group: i, after: true }; b.motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
