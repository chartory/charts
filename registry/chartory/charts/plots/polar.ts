// C.polar (Figma ember-chart.js): polar area (rose): equal-angle sectors from 12 o'clock, radius by √value, four guide
// rings, and the side list (C.sideList) with values and shares. The radius leaves the list 128 px or more.
import { paint, type Kit } from "../core/kit";
import { ellipse, type Frame } from "../core/node";

export type PolarData = { items: { label: string; v: number; tok: string; text: string; pct?: string }[] };

export function polar(K: Kit, p: Frame, w: number, o: PolarData): Frame {
  const pl = K.plot(p, "polar", w, K.PH);
  const R = Math.floor(Math.min(180, K.PH - 16, w - 168) / 2), cx = 8 + R, cy = Math.floor(K.PH / 2);
  const vmax = Math.max(...o.items.map((i) => i.v)), n = o.items.length;
  for (const f of [0.25, 0.5, 0.75, 1]) K.guideRing(pl, cx, cy, Math.round(R * f));
  // sectors: no sweep kind yet, so they fade in order around the rose
  o.items.forEach((it, i) => {
    const r = Math.round(R * Math.sqrt(it.v / vmax));
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const e = ellipse(pl, "sector · " + it.label.toLowerCase(), cx - r, cy - r, 2 * r, 2 * r, {
      fill: paint(it.tok), arc: { start: a, end: a + (2 * Math.PI) / n, inner: 0 }, stroke: paint(K.BG), sw: 2, align: "center",
    });
    e.motion = { kind: "sweep", order: i, group: i };
  });
  K.sideList(pl, cx + R + 32, w - (cx + R + 32), o.items.map((it) => ({ label: it.label, tok: it.tok, text: it.text, pct: it.pct })));
  return pl;
}
