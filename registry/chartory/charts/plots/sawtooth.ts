// C.sawtooth (Figma ember-chart-5.js, type 84): stock on hand as a step line with a light area under it, stockout
// spans as danger bands, a dashed reorder line with its caps label, arrival dots, y grid and date labels.
import { box, dash, place, X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type SawtoothData = { vals: number[]; reorder: number; max: number; ticks: string[]; arrivals: number[]; xl: Record<number, string> };

/** C.path(pts) as Figma stores it on an open stroke: a zero-length segment (a repeated point, where the stock stays
 *  at 0) becomes its own closed sub-path, "M p L p Z M p" (the vector network re-encoding; it draws the same line). */
function strokePath(pts: [number, number][]): string {
  return pts.map((p, i) => {
    const q = pts[i - 1], at = p[0] + " " + p[1];
    if (!i) return "M " + at;
    return q[0] === p[0] && q[1] === p[1] ? "M " + at + " L " + at + " Z M " + at : "L " + at;
  }).join(" ");
}

export function sawtooth(K: Kit, p: Frame, w: number, o: SawtoothData): Frame {
  const pl = K.plot(p, "sawtooth", w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.vals.length, xs = (i: number) => X(i, n, yW, w), y = (v: number) => K.yMap(v, 0, o.max);
  const pts: [number, number][] = [];
  o.vals.forEach((v, i) => { if (i) pts.push([xs(i), y(o.vals[i - 1])]); pts.push([xs(i), y(v)]); });
  K.vec(pl, "stock area", K.path(pts) + " L " + xs(n - 1) + " " + K.BASE + " L " + xs(0) + " " + K.BASE + " Z", { fill: "data/primary", opacity: 0.14 }).motion = { kind: "reveal", order: 0 };
  K.vec(pl, "stock", strokePath(pts), { stroke: "data/primary", sw: 1.5 }).motion = { kind: "draw", order: 0 };
  let i = 0, so = 0;
  while (i < n) {
    if (o.vals[i] === 0) {
      let j = i;
      while (j < n && o.vals[j] === 0) j++;
      box(K, pl, "stockout", xs(i), K.TOP, Math.max(4, xs(Math.min(n - 1, j)) - xs(i)), K.BASE - K.TOP, "status/danger", 0, 0.18).motion = { kind: "fade", order: 1 + so++, after: true };
      i = j;
    } else i++;
  }
  dash(K, pl, "reorder point", "M " + yW + " " + y(o.reorder) + " L " + w + " " + y(o.reorder), "status/warning", 1.5);
  const rt = K.caps(pl, "REORDER " + o.reorder, "status/warning");
  place(rt, yW + 6, y(o.reorder) + 4);
  o.arrivals.forEach((a, k) => {
    const d = K.dot(pl, 8, "strong", "arrival");
    d.x = xs(a) - 4; d.y = y(o.vals[a]) - 4;
    d.motion = { kind: "pop", order: k, after: true };
  });
  for (const [k2, t] of Object.entries(o.xl)) { const kk = +k2; K.xAt(pl, t, xs(kk), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center"); }
  return pl;
}
