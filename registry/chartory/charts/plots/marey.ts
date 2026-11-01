// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.marey (Figma ember-chart-4.js): a Marey schedule: stops as horizontal lines top to bottom, each van a line
// through (arrive, depart) at every stop on a time axis (late vans 2.5 px), the plan as a dashed line.
import { dash, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type MareyData = {
  stops: string[]; t0: number; t1: number; xt: [number, string][];
  vans: { label: string; tok: string; times: [number, number][]; late?: boolean }[];
  plan?: [number, number][];
};

export function marey(K: Kit, p: Frame, w: number, o: MareyData): Frame {
  const pl = K.plot(p, "marey", w, K.PH);
  const lW = 64, n = o.stops.length, step = Math.floor((K.BASE - 10) / (n - 1));
  const y = (i: number) => 10 + i * step, x = (t: number) => lW + Math.round(((t - o.t0) / (o.t1 - o.t0)) * (w - lW));
  for (let i = 0; i < n; i++) {
    K.rect(pl, "stop line · " + o.stops[i].toLowerCase(), lW, y(i), w - lW, 1, "grid");
    const t = K.caps(pl, o.stops[i], "body");
    t.name = "stop · " + o.stops[i].toLowerCase(); place(t, 0, y(i) - 7);
  }
  const pts = (ts: [number, number][]) => ts.flatMap((q, i): [number, number][] => [[x(q[0]), y(i)], [x(q[1]), y(i)]]);
  // Figma stores a repeated last point (arrive = depart at the end stop) as a closed zero-length subpath
  // ("… L p M p L p Z"); write it the same way (same drawing: the end cap is already there)
  const route = (ts: [number, number][]) => {
    const q = pts(ts), a = q[q.length - 2], b = q[q.length - 1];
    if (a[0] !== b[0] || a[1] !== b[1]) return K.path(q);
    return K.path(q.slice(0, -1)) + " M " + b[0] + " " + b[1] + " L " + b[0] + " " + b[1] + " Z";
  };
  // the plan is a reference line (chrome); the vans draw along their route in departure order
  if (o.plan) dash(K, pl, "plan", route(o.plan), "body");
  o.vans.forEach((v, i) => {
    K.vec(pl, "van · " + v.label.toLowerCase(), route(v.times), { stroke: v.tok, sw: v.late ? 2.5 : 1.5 }).motion = { kind: "draw", order: i, group: i };
  });
  for (const [t, s] of o.xt) K.xAt(pl, s, x(t), K.PH - 14, t === o.t0 ? "start" : t === o.t1 ? "end" : "center");
  return pl;
}
