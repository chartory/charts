// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.arcDiagram (Figma ember-chart-4.js): nodes on a baseline, sized by value (8 + 2 × 0–5 px), with a ground ring;
// links arc above the line (height 0.62 × span), coloured by their source, width 1–6 px by value, at 65 %.
import { X, paint, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ArcDiagramData = { nodes: { label: string; v: number; tok: string }[]; links: [number, number, number][] };

export function arcDiagram(K: Kit, p: Frame, w: number, o: ArcDiagramData): Frame {
  const pl = K.plot(p, "arc diagram", w, K.PH);
  const n = o.nodes.length, yb = K.PH - 40, x0 = 24, x1 = w - 24;
  const xs = (i: number) => X(i, n, x0, x1);
  const lm = Math.max(...o.links.map((l) => l[2])), nm = Math.max(...o.nodes.map((q) => q.v));
  K.rect(pl, "baseline", 0, yb, w, 1, "grid");
  o.links.forEach(([a, b, v], i) => {
    const xa = xs(a), xb = xs(b);
    const h = Math.min(yb - 6, Math.abs(xb - xa) * 0.62);
    const l = K.vec(pl, "link · " + o.nodes[a].label.toLowerCase() + " → " + o.nodes[b].label.toLowerCase(),
      "M " + xa + " " + yb + " C " + xa + " " + (yb - h) + " " + xb + " " + (yb - h) + " " + xb + " " + yb,
      { stroke: o.nodes[a].tok, sw: +(1 + (v / lm) * 5).toFixed(1) });
    l.opacity = 0.65;
    // links draw from their source after the nodes, in data order
    l.motion = { kind: "draw", order: n + i, group: a };
  });
  for (let i = 0; i < n; i++) {
    const q = o.nodes[i];
    const s = 8 + 2 * Math.round((q.v / nm) * 5);
    const d = K.dot(pl, s, q.tok, "node · " + q.label.toLowerCase());
    d.x = xs(i) - s / 2; d.y = yb - s / 2;
    d.stroke = paint(K.BG); d.sw = 2; d.align = "outside";
    d.motion = { kind: "pop", order: i, group: i };
    K.xAt(pl, q.label, xs(i), yb + 14, "center");
  }
  return pl;
}
