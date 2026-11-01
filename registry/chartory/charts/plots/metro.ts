// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.metro (Figma ember-chart-4.js, type 57): a route as a two-row metro line with a turn, the travelled part in
// data/primary over the planned track, stops as rings (the current one with a halo), names and times under the stops
// (every stop when there is room, else every other one and the current stop).
import { cell, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type MetroData = { stops: { name: string; eta: string; state: "done" | "now" | "next" }[] };

export function metro(K: Kit, p: Frame, w: number, o: MetroData): Frame {
  const pl = K.plot(p, "route line", w, K.PH);
  const n = o.stops.length, half = Math.ceil(n / 2), x0 = 36, x1 = w - 44, sp6 = Math.floor((x1 - x0) / (half - 1)), y1 = 36, y2 = Math.min(110, K.PH - 50);
  const pos = (i: number): [number, number] => (i < half ? [x0 + i * sp6, y1] : [x0 + (n - 1 - i) * sp6, y2]);
  const xr = x0 + (half - 1) * sp6;
  const pathTo = (m: number) => {
    let d = "M " + x0 + " " + y1;
    for (let i = 1; i <= m; i++) {
      const [x, y] = pos(i);
      if (i === half) d += " C " + (xr + 36) + " " + y1 + " " + (xr + 36) + " " + y2 + " " + xr + " " + y2;
      if (i !== half || x !== xr) d += " L " + x + " " + y;
    }
    return d;
  };
  K.vec(pl, "track", pathTo(n - 1), { stroke: "data/track", sw: 4 }).motion = { kind: "draw", order: 0 };
  const now = o.stops.findIndex((s) => s.state === "now");
  K.vec(pl, "travelled", pathTo(now), { stroke: "data/primary", sw: 4 }).motion = { kind: "draw", order: 1 };
  for (let i = 0; i < n; i++) {
    const s = o.stops[i];
    const [x, y] = pos(i);
    if (s.state === "now") {
      const h = K.dot(pl, 22, "data/primary", "halo");
      h.opacity = 0.25; h.x = x - 11; h.y = y - 11;
      h.motion = { kind: "pop", order: i, group: i, after: true };
    }
    const d = K.dot(pl, 12, s.state === "next" ? K.BG : "data/primary", "stop · " + s.name.toLowerCase());
    d.x = x - 6; d.y = y - 6;
    d.stroke = { tok: s.state === "next" ? "data/track" : "composer/field" }; d.sw = 2; d.align = "inside";
    // stops pop along the route
    d.motion = { kind: "pop", order: i, group: i };
    const show = sp6 >= 64 || s.state === "now" || (i % 2 === 0 && Math.abs(i - now) !== 1);
    if (!show) continue;
    const lw = sp6 >= 64 ? sp6 - 4 : 2 * sp6 - 4;
    let lx = x - Math.floor(lw / 2), al: "center" | "left" | "right" = "center";
    if (lx < 0) { lx = Math.max(0, x - 12); al = "left"; }
    if (lx + lw > w) { lx = Math.min(w - lw, x + 12 - lw); al = "right"; }
    cell(K, pl, s.name, lx, y + 12, lw, "Body/S", s.state === "next" ? "body" : "strong", al).motion = { kind: "fade", order: i, group: i, after: true };
    cell(K, pl, s.eta, lx, y + 32, lw, "Label/Caps", s.state === "now" ? "data/primary" : "label", al).motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
