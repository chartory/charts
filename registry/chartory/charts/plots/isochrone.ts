// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.isochrone (Figma ember-chart-5.js, type 88): drive-time rings round a depot (filled zones, deeper inwards, with
// a grid edge each), stops as dots at their angle and minutes (late = danger), the depot dot, and the side list.
import { paint, P, type Kit, type Row } from "../core/kit";
import { ellipse, type Frame } from "../core/node";

export type IsochroneData = { rings: number[]; pts: [number, number, boolean][]; rows: Row[] };

export function isochrone(K: Kit, p: Frame, w: number, o: IsochroneData): Frame {
  const pl = K.plot(p, "isochrone", w, K.PH);
  const R = Math.floor(Math.min(K.PH - 12, w - 148) / 2), cx = 8 + R, cy = Math.floor(K.PH / 2);
  const mx = o.rings[o.rings.length - 1];
  for (let i = o.rings.length - 1; i >= 0; i--) {
    const r = Math.round((o.rings[i] / mx) * R);
    const e = ellipse(pl, "zone · " + o.rings[i], cx - r, cy - r, 2 * r, 2 * r, { fill: paint("data/primary") });
    e.opacity = 0.05 + 0.04 * (o.rings.length - i);
    // zones open from the depot outwards
    e.motion = { kind: "pop", order: i };
    ellipse(pl, "edge · " + o.rings[i], cx - r, cy - r, 2 * r, 2 * r, { stroke: paint("grid"), sw: 1, align: "inside" });
  }
  o.pts.forEach(([a, m, late], k) => {
    const [x, y] = P(cx, cy, (m / mx) * R, a);
    const d = K.dot(pl, 6, late ? "status/danger" : "status/success", "stop");
    d.x = Math.round(x - 3); d.y = Math.round(y - 3);
    d.motion = { kind: "pop", order: Math.round(m / 5), group: k, after: true };
  });
  const dp = K.dot(pl, 12, "strong", "depot");
  dp.x = cx - 6; dp.y = cy - 6;
  K.sideList(pl, cx + R + 28, w - (cx + R + 28), o.rows);
  return pl;
}
