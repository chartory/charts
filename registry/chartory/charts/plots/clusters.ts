// C.clusters (Figma ember-chart-5.js, type 91): topic clusters as soft hulls (an ellipse at 10 % with a dashed outline)
// around seeded Gaussian-ish point clouds (Park–Miller generator, sum of three uniforms), a caps name above each hull.
import { paint, place, type Kit } from "../core/kit";
import { ellipse, type Frame } from "../core/node";

export type ClustersData = {
  seed?: number;
  clusters: { label: string; tok: string; cx: number; cy: number; sx: number; sy: number; n: number }[];
};

export function clusters(K: Kit, p: Frame, w: number, o: ClustersData): Frame {
  const pl = K.plot(p, "cluster map", w, K.PH);
  let s = o.seed ?? 9;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  o.clusters.forEach((c, ci) => {
    const X0 = c.cx * w, Y0 = c.cy * (K.PH - 8);
    const ew = Math.round(c.sx * 2.6), eh = Math.round(c.sy * 2.6), ex = Math.round(X0 - c.sx * 1.3), ey = Math.round(Y0 - c.sy * 1.3);
    const e = ellipse(pl, "hull · " + c.label.toLowerCase(), ex, ey, ew, eh, { fill: paint(c.tok) });
    e.opacity = 0.1;
    e.motion = { kind: "fade", order: ci, group: ci };
    const s2 = ellipse(pl, "outline · " + c.label.toLowerCase(), ex, ey, ew, eh, { stroke: paint(c.tok), sw: 1, align: "inside" });
    s2.dash = [3, 3];
    s2.motion = { kind: "fade", order: ci, group: ci };
    for (let i = 0; i < c.n; i++) {
      const d = K.dot(pl, 5, c.tok, "point");
      d.x = Math.round(X0 + g() * c.sx - 2.5); d.y = Math.round(Y0 + g() * c.sy - 2.5);
      d.motion = { kind: "pop", order: ci, group: ci };
    }
    const t = K.caps(pl, c.label, "strong");
    place(t, X0 - Math.ceil(t.w) / 2, Y0 - c.sy * 1.3 - 16);
    t.motion = { kind: "fade", order: ci, group: ci, after: true };
  });
  return pl;
}
