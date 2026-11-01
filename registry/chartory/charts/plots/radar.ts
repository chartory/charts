// C.radar (Figma ember-chart.js): a web of four rings and a spoke per axis, axis names outside, and per series a
// translucent area, its outline and a dot on each vertex. Series draw back to front in the given order.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type RadarData = { axes: string[]; max: number; series: { name: string; tok: string; vals: number[] }[] };

export function radar(K: Kit, p: Frame, w: number, o: RadarData): Frame {
  const pl = K.plot(p, "radar", w, K.PH);
  const R = Math.floor((K.PH - 40) / 2), cx = Math.round(w / 2), cy = Math.floor(K.PH / 2), n = o.axes.length;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, f: number): [number, number] => [+(cx + Math.cos(ang(i)) * R * f).toFixed(2), +(cy + Math.sin(ang(i)) * R * f).toFixed(2)];
  for (const f of [0.25, 0.5, 0.75, 1]) K.vec(pl, "web " + f, K.path(o.axes.map((_, i) => pt(i, f))) + " Z", { stroke: "grid", sw: 1 });
  for (let i = 0; i < n; i++) {
    K.vec(pl, "spoke " + (i + 1), "M " + cx + " " + cy + " L " + pt(i, 1).join(" "), { stroke: "grid", sw: 1 });
    const t = K.caps(pl, o.axes[i], "axis");
    const [lx, ly] = pt(i, 1.12), tw = Math.ceil(t.w), c = Math.cos(ang(i));
    t.x = Math.round(Math.abs(c) < 0.2 ? lx - tw / 2 : c > 0 ? lx : lx - tw); t.y = Math.round(ly - 7);
  }
  o.series.forEach((s, si) => {
    const pts = s.vals.map((v, i) => pt(i, v / o.max));
    K.vec(pl, "area · " + s.name.toLowerCase(), K.path(pts) + " Z", { fill: s.tok, opacity: 0.18 }).motion = { kind: "fade", order: si, group: si };
    K.vec(pl, "outline · " + s.name.toLowerCase(), K.path(pts) + " Z", { stroke: s.tok, sw: 2 }).motion = { kind: "draw", order: si, group: si };
    for (const [x, y] of pts) {
      const d = K.dot(pl, 6, s.tok, "vertex");
      d.x = Math.round(x) - 3; d.y = Math.round(y) - 3;
      d.motion = { kind: "pop", order: si, group: si, after: true };
    }
  });
  return pl;
}
