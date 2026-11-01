// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.radialLolli2 (Figma ember-chart-5.js, type 94 v2): a year of values as stems from an inner ring, value guide
// rings, month letters outside, the latest month hot (data/primary, thicker, ringed head), a centred caption and the
// side list (C.sideList) with its narrow-size rules. The radius keeps 120 px for the list on narrow plots.
import { ctr, P, place, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type RadialLollipopData = {
  min: number; max: number; rings: number[]; labels: string[]; vals: number[];
  center: [StyleName, string, string][]; rows: Row[];
};

export function radialLollipop(K: Kit, p: Frame, w: number, o: RadialLollipopData): Frame {
  const pl = K.plot(p, "radial lollipop", w, K.PH);
  const R = Math.min(Math.floor((K.PH - 4) / 2), Math.floor((w - 152) / 2));
  const cx = 4 + R, cy = Math.floor(K.PH / 2), r0 = Math.round(R * 0.3), rs = R - 22, n = o.vals.length, st = (2 * Math.PI) / n;
  const rv = (v: number) => r0 + 6 + ((v - o.min) / (o.max - o.min)) * (rs - r0 - 6);
  const ang = (i: number) => -Math.PI / 2 + (i + 0.5) * st;
  for (const v of o.rings) K.guideRing(pl, cx, cy, Math.round(rv(v)));
  const last = n - 1;
  for (let i = 0; i < n; i++) {
    const a = ang(i);
    const [x0, y0] = P(cx, cy, r0, a), [x1, y1] = P(cx, cy, rv(o.vals[i]), a);
    const hot = i === last;
    const sl = K.vec(pl, "stem · " + o.labels[i].toLowerCase(), "M " + x0 + " " + y0 + " L " + x1 + " " + y1, { stroke: hot ? "data/primary" : "data/primary-soft", sw: hot ? 3 : 2 });
    if (!hot) sl.opacity = 0.55;
    sl.motion = { kind: "draw", order: i, group: i };
    const s = hot ? 10 : 6;
    const d = K.dot(pl, s, hot ? "data/primary" : "data/primary-soft", "head · " + o.labels[i].toLowerCase());
    d.x = Math.round(x1 - s / 2); d.y = Math.round(y1 - s / 2);
    if (hot) { d.stroke = { tok: "composer/field" }; d.sw = 2; d.align = "outside"; }
    d.motion = { kind: "pop", order: i, group: i, after: true };
    const [lx, ly] = P(cx, cy, R - 8, a);
    const t = K.caps(pl, o.labels[i], hot ? "strong" : "axis");
    t.name = "month · " + o.labels[i].toLowerCase();
    place(t, lx - Math.ceil(t.w) / 2, ly - 7);
  }
  const c = ctr(K, pl, "centre", o.center, 0);
  place(c, cx - c.w / 2, cy - c.h / 2);
  K.sideList(pl, cx + R + 28, w - (cx + R + 28), o.rows);
  return pl;
}
