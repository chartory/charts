// C.driftArrows (Figma ember-chart-5.js, type 89): per asset a target tick, a dot at the current weight and an
// arrow from it to the target (warning when overweight, info when under, body within 0.6 pt), the drift in points
// at the right edge, vertical grid with % labels.
import { box, place, tri, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type DriftArrowsData = { max: number; xt: [number, string][]; rows: { label: string; now: number; target: number }[] };

export function driftArrows(K: Kit, p: Frame, w: number, o: DriftArrowsData): Frame {
  const pl = K.plot(p, "drift arrows", w, K.PH);
  const lW = 80, rW = 56, k = o.rows.length, rh = Math.floor((K.PH - 22) / k);
  const x = (v: number) => lW + Math.round((v / o.max) * (w - lW - rW));
  for (const [v, t] of o.xt) { K.rect(pl, "grid · " + t, x(v), 0, 1, k * rh, "grid"); K.xAt(pl, t, x(v), K.PH - 14, "center"); }
  for (let r = 0; r < k; r++) {
    const q = o.rows[r];
    const cy = r * rh + Math.round(rh / 2);
    const over = q.now > q.target;
    const tok = Math.abs(q.now - q.target) < 0.6 ? "body" : over ? "status/warning" : "status/info";
    const lb = K.T(pl, "Body/S", q.label, "strong");
    place(lb, 0, cy - lb.h / 2);
    box(K, pl, "target · " + q.label.toLowerCase(), x(q.target) - 1, cy - 8, 2, 16, "strong", 1);
    const xa = x(q.now), xb = x(q.target);
    if (Math.abs(xb - xa) > 8) {
      const dir = xb > xa ? 1 : -1;
      K.vec(pl, "drift", "M " + xa + " " + cy + " L " + (xb - dir * 8) + " " + cy, { stroke: tok, sw: 2 }).motion = { kind: "draw", order: r, group: r };
      tri(K, pl, "head", [[xb - dir * 3, cy], [xb - dir * 10, cy - 5], [xb - dir * 10, cy + 5]], tok).motion = { kind: "pop", order: r, group: r, after: true };
    }
    const d = K.dot(pl, 10, tok, "now");
    d.x = xa - 5; d.y = cy - 5;
    d.motion = { kind: "pop", order: r, group: r };
    const t = K.caps(pl, (q.now - q.target > 0 ? "+" : "−") + Math.abs(q.now - q.target).toFixed(1) + " PT", tok);
    place(t, w - Math.ceil(t.w), cy - 7);
    t.motion = { kind: "fade", order: r, group: r, after: true };
  }
  return pl;
}
