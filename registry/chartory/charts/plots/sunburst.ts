// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.sunburst (Figma ember-chart.js): two rings from 12 o'clock: groups (teams) inside, their items (models) outside at
// falling opacity; a centred value + caps (the value steps down to Body/L when the hole is too small) and the side
// list (C.sideList) with each group's total and, when the list is 260 px or wider, its first two items.
import { paint, type Kit } from "../core/kit";
import { ellipse, layout, remove, type Frame } from "../core/node";

export type SunburstData = { center: { value: string; caps: string }; groups: { label: string; tok: string; items: [string, number][] }[] };

export function sunburst(K: Kit, p: Frame, w: number, o: SunburstData): Frame {
  const pl = K.plot(p, "sunburst", w, K.PH);
  const R = Math.floor(Math.min(184, K.PH - 12, w - 152) / 2), cx = 8 + R, cy = Math.floor(K.PH / 2);
  const r1 = Math.round(R * 0.56), r2 = Math.round(R * 0.76), r3 = Math.round(R * 0.8);
  const sum = (g: SunburstData["groups"][number]) => g.items.reduce((s, i) => s + i[1], 0);
  const tot = o.groups.reduce((a, g) => a + sum(g), 0);
  let a = -Math.PI / 2, order = 0;
  const ring = (name: string, ri: number, ro: number, a0: number, a1: number, tok: string, op: number) => {
    const e = ellipse(pl, name, cx - ro, cy - ro, 2 * ro, 2 * ro, {
      fill: paint(tok), arc: { start: a0, end: a1, inner: ri / ro }, stroke: paint(K.BG), sw: 1.5, align: "center",
    });
    if (op < 1) e.opacity = op;
    return e;
  };
  // arcs: no sweep kind yet, so each team fades in around the ring, its models right after it
  o.groups.forEach((g, gi) => {
    const ga = (2 * Math.PI * sum(g)) / tot;
    ring("team · " + g.label.toLowerCase(), r1, r2, a, a + ga, g.tok, 1).motion = { kind: "sweep", order: order++, group: gi };
    let b = a;
    g.items.forEach((it, k) => {
      const ia = (2 * Math.PI * it[1]) / tot;
      ring("model · " + g.label.toLowerCase() + " · " + it[0].toLowerCase(), r3, R, b, b + ia, g.tok, [0.9, 0.65, 0.45, 0.35][k] ?? 0.3).motion = { kind: "sweep", order: order++, group: gi };
      b += ia;
    });
    a += ga;
  });
  const c = K.AL(pl, "centre", "VERTICAL", { cross: "CENTER", gap: 2 });
  const cv = K.T(c, "Display/M", o.center.value, "strong");
  K.caps(c, o.center.caps);
  layout(c);
  // small hole (narrow plots): the centre value steps down a style instead of spilling over the ring
  if (c.w > 2 * r1 - 8) {
    remove(cv);
    const v2 = K.T(c, "Body/L", o.center.value, "strong");
    c.children = [v2, ...c.children.filter((x) => x !== v2)];
    layout(c);
  }
  c.x = cx - Math.round(c.w / 2); c.y = cy - Math.round(c.h / 2);
  for (const t of c.children) t.motion = { kind: "fade", order, after: true };
  const lw = w - (cx + R + 32);
  K.sideList(pl, cx + R + 32, lw, o.groups.map((g) => ({
    label: g.label, tok: g.tok, text: "$" + (sum(g) / 10).toFixed(1) + "K",
    pct: lw >= 260 ? g.items.map((i) => i[0]).slice(0, 2).join(" · ").toUpperCase() : undefined,
  })));
  return pl;
}
