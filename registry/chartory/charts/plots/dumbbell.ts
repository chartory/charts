// C.dumbbell (Figma ember-chart-4.js): per row, our value and the competitor's as ringed dots joined by a bar
// (success when ours is lower, danger when higher), the gap in a right column, vertical grid at the x ticks.
import { paint, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type DumbbellData = {
  rows: { label: string; a: number; b: number }[]; min: number; max: number; xt: [number, string][];
  /** the gap column's text (default: the kit's price gap, a − b in dollars) */
  gap?: (a: number, b: number) => string;
  /** a higher a is the good side (a change from b to a: success when it rises); default: the kit's lower price is good */
  up?: boolean;
};

export function dumbbell(K: Kit, p: Frame, w: number, o: DumbbellData): Frame {
  const pl = K.plot(p, "dumbbell", w, K.PH);
  const lW = 96, rW = 44, k = o.rows.length, rh = Math.floor((K.PH - 22) / k);
  const x = (v: number) => lW + Math.round(((v - o.min) / (o.max - o.min)) * (w - lW - rW));
  for (const [v, t] of o.xt) { K.rect(pl, "grid · " + t, x(v), 0, 1, k * rh, "grid"); K.xAt(pl, t, x(v), K.PH - 14, "center"); }
  for (let r = 0; r < k; r++) {
    const q = o.rows[r];
    const cy = r * rh + Math.round(rh / 2);
    const tok = (o.up ? q.a >= q.b : q.a <= q.b) ? "status/success" : "status/danger";
    const lb = K.T(pl, "Body/S", q.label, "strong");
    lb.name = "product · " + q.label.toLowerCase(); place(lb, 0, cy - lb.h / 2);
    K.rect(pl, "gap · " + q.label.toLowerCase(), Math.min(x(q.a), x(q.b)), cy - 1, Math.max(2, Math.abs(x(q.a) - x(q.b))), 2, tok, 1).motion = { kind: "reveal", order: r, group: r, after: true };
    for (const [v, tk, nm] of [[q.b, "data/cat-2", "competitor"], [q.a, "data/primary", "ours"]] as [number, string, string][]) {
      const d = K.dot(pl, 10, tk, nm);
      d.x = x(v) - 5; d.y = cy - 5;
      d.stroke = paint(K.BG); d.sw = 2; d.align = "outside";
      d.motion = { kind: "pop", order: r, group: r };
    }
    const g = K.caps(pl, o.gap ? o.gap(q.a, q.b) : (q.a - q.b > 0 ? "+$" : "−$") + Math.abs(q.a - q.b), tok);
    place(g, w - Math.ceil(g.w), cy - 7);
    g.motion = { kind: "fade", order: r, group: r, after: true };
  }
  return pl;
}
