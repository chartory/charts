// C.horizon (Figma ember-chart-4.js, type 54): one row per series, values folded into three bands of `band` each
// (30 / 60 / 100 %), above zero in data/primary and below in data/cat-2, with the pair name on the left.
import { place, X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type HorizonData = { rows: { label: string; vals: number[] }[]; band: number; xl: Record<number, string> };

export function horizon(K: Kit, p: Frame, w: number, o: HorizonData): Frame {
  const pl = K.plot(p, "horizon", w, K.PH);
  const lW = 72, k = o.rows.length, rh = Math.floor((K.PH - 22) / k), n = o.rows[0].vals.length;
  const xs = (i: number) => X(i, n, lW, w);
  for (let r = 0; r < k; r++) {
    const row = o.rows[r];
    const yb = r * rh + rh - 3, bh = rh - 6;
    K.rect(pl, "row base · " + row.label.toLowerCase(), lW, yb, w - lW, 1, "grid");
    const lb = K.caps(pl, row.label, "body");
    lb.name = "pair · " + row.label.toLowerCase();
    place(lb, 0, yb - bh / 2 - 7);
    for (const [sign, tok] of [[1, "data/primary"], [-1, "data/cat-2"]] as const)
      for (let b = 0; b < 3; b++) {
        const pts = row.vals.map((v, i) => [xs(i), +(yb - (Math.max(0, Math.min(o.band, sign * v - b * o.band)) / o.band) * bh).toFixed(2)] as [number, number]);
        if (pts.every((q) => q[1] === yb)) continue;
        const v = K.vec(pl, (sign > 0 ? "up" : "down") + " band " + (b + 1) + " · " + row.label.toLowerCase(), K.path(pts) + " L " + xs(n - 1) + " " + yb + " L " + lW + " " + yb + " Z", { fill: tok, opacity: [0.3, 0.6, 1][b] });
        // the bands of a row wipe in left to right together, rows top to bottom
        v.motion = { kind: "reveal", order: r, group: r };
      }
  }
  for (const [i, t] of Object.entries(o.xl)) { const kk = +i; K.xAt(pl, t, xs(kk), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center"); }
  return pl;
}
