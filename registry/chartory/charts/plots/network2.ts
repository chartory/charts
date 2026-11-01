// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.network2 (Figma ember-chart-2.js, type 39): a hub (halo + ringed disc with its label) and up to six nodes on a
// dashed orbit guide at fixed angles (three right, three left), each tied to the hub by a curved edge whose weight
// follows its value; nodes are sized by value (tinted fill, 2 px ring, core dot) with name and value · share beside.
import { paint, type Kit } from "../core/kit";
import { ellipse, layout, type Ellipse, type Frame } from "../core/node";

export type Network2Data = { hub: string; hubSub: string; nodes: { label: string; v: number; tok: string; text: string; subs?: number[] }[] };

export function network2(K: Kit, p: Frame, w: number, o: Network2Data): Frame {
  const pl = K.plot(p, "network", w, K.PH);
  const cx = Math.round(w / 2), cy = Math.round(K.PH / 2);
  const Rx = Math.round(w / 2) - 104, Ry = Math.round(K.PH / 2) - 30;
  const vmax = Math.max(...o.nodes.map((x) => x.v));
  const tot = o.nodes.reduce((a, x) => a + x.v, 0);
  // Figma: createEllipse, stroke inside, dashPattern [2, 4]. The node model has no dash on ellipses yet: set it as a
  // property the diff reads (the renderer draws ellipse strokes solid until it reads `dash` too).
  const guide = ellipse(pl, "orbit guide", cx - Rx, cy - Ry, 2 * Rx, 2 * Ry, { stroke: paint("grid"), sw: 1, align: "inside" });
  Object.assign(guide, { dash: [2, 4] });
  const angles = [-38, 0, 38, 142, 180, 218].map((a) => (a * Math.PI) / 180);
  const P = o.nodes.map((_, i) => [Math.round(cx + Math.cos(angles[i]) * Rx), Math.round(cy + Math.sin(angles[i]) * Ry)] as [number, number]);
  const D = o.nodes.map((nd) => 2 * Math.round(9 + (9 * nd.v) / vmax));
  // Figma stores stroke weights as float32 (3.6 → 3.5999999046…): Math.fround keeps the same number
  // edges draw out from the hub, one node after another (data order = weight order)
  o.nodes.forEach((nd, i) => {
    const [x, y] = P[i];
    const a0 = Math.atan2(y - cy, x - cx);
    const sx = +(cx + Math.cos(a0) * 34).toFixed(2), sy = +(cy + Math.sin(a0) * 34).toFixed(2);
    const ex = +(x - Math.cos(a0) * (D[i] / 2 + 2)).toFixed(2), ey = +(y - Math.sin(a0) * (D[i] / 2 + 2)).toFixed(2);
    const mx = +((sx + ex) / 2).toFixed(2);
    const e = K.vec(pl, "edge · " + nd.label.toLowerCase(), "M " + sx + " " + sy + " C " + mx + " " + sy + " " + mx + " " + ey + " " + ex + " " + ey,
      { stroke: nd.tok, sw: Math.fround(Math.max(1.5, +(1 + (4 * nd.v) / vmax).toFixed(1))), opacity: 0.55 });
    e.motion = { kind: "draw", order: i + 1, group: i };
  });
  const halo = K.dot(pl, 84, "data/primary", "hub halo"); halo.x = cx - 42; halo.y = cy - 42; halo.opacity = 0.12;
  const hub = K.dot(pl, 64, K.BG, "hub"); hub.x = cx - 32; hub.y = cy - 32;
  hub.stroke = paint("data/primary"); hub.sw = 2; hub.align = "inside";
  halo.motion = { kind: "pop", order: 0 }; hub.motion = { kind: "pop", order: 0 };
  const hl = K.AL(pl, "hub label", "VERTICAL", { cross: "CENTER" });
  K.caps(hl, o.hubSub); K.T(hl, "Label/S", o.hub, "strong");
  layout(hl);
  hl.x = cx - Math.round(hl.w / 2); hl.y = cy - Math.round(hl.h / 2);
  for (const t of hl.children) t.motion = { kind: "fade", order: 0, after: true };
  for (let i = 0; i < o.nodes.length; i++) {
    const nd = o.nodes[i], [x, y] = P[i], d = D[i];
    const pop = (n: Ellipse) => { n.motion = { kind: "pop", order: i + 1, group: i, after: true }; };
    const bg = K.dot(pl, d, nd.tok, "node fill · " + nd.label.toLowerCase()); bg.x = x - Math.round(d / 2); bg.y = y - Math.round(d / 2); bg.opacity = 0.22; pop(bg);
    const ring = K.ring(pl, "node · " + nd.label.toLowerCase(), x, y, d, nd.tok); ring.fill = undefined; ring.sw = 2; pop(ring);
    const core = K.dot(pl, 6, nd.tok, "core"); core.x = x - 3; core.y = y - 3; pop(core);
    const right = x > cx;
    const t = K.AL(pl, "label · " + nd.label.toLowerCase(), "VERTICAL", { gap: 1, cross: right ? "MIN" : "MAX" });
    K.T(t, "Label/S", nd.label, "strong");
    K.caps(t, nd.text + " · " + Math.round((nd.v / tot) * 100) + "%");
    layout(t);
    t.x = right ? x + d / 2 + 8 : x - d / 2 - 8 - Math.ceil(t.w); t.y = y - Math.round(t.h / 2);
    for (const c of t.children) c.motion = { kind: "fade", order: i + 1, group: i, after: true };
  }
  return pl;
}
