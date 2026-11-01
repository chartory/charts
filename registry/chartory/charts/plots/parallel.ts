// C.parallel (Figma ember-chart-3.js): parallel coordinates; one vertical axis per measure (0–100), a straight
// polyline per row at 60 % (1.5 px), the focus row drawn last at 3 px with ringed points; axis names under the axes
// (first left-aligned, last right-aligned).
import { X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type ParallelData = { focus: string; axes: string[]; rows: { label: string; tok: string; vals: number[] }[] };

export function parallel(K: Kit, p: Frame, w: number, o: ParallelData): Frame {
  const pl = K.plot(p, "parallel coordinates", w, K.PH);
  const n = o.axes.length, x0 = 6, x1 = w - 7;
  const y = (v: number) => K.yMap(v, 0, 100);
  for (let i = 0; i < n; i++) {
    const x = X(i, n, x0, x1);
    K.rect(pl, "axis · " + o.axes[i].toLowerCase(), x, K.TOP, 1, K.BASE - K.TOP, "grid");
    K.xAt(pl, o.axes[i], i === 0 ? 0 : i === n - 1 ? w : x, K.PH - 14, i === 0 ? "start" : i === n - 1 ? "end" : "center");
  }
  const ordered = o.rows.filter((r) => r.label !== o.focus).concat(o.rows.filter((r) => r.label === o.focus));
  ordered.forEach((r, ri) => {
    const f = r.label === o.focus, g = o.rows.indexOf(r);
    const pts = r.vals.map((v, i) => [X(i, n, x0, x1), y(v)] as [number, number]);
    const ln = K.vec(pl, "line · " + r.label.toLowerCase(), K.path(pts), { stroke: r.tok, sw: f ? 3 : 1.5 });
    if (!f) ln.opacity = 0.6;
    ln.motion = { kind: "draw", order: ri, group: g };
    if (f) pts.forEach(([px, py], i) => {
      const d = K.ring(pl, "point · " + r.label.toLowerCase(), px, py, 10, r.tok);
      d.sw = 2; d.x = Math.round(d.x); d.y = Math.round(d.y);
      d.motion = { kind: "pop", order: i, group: g, after: true };
    });
  });
  return pl;
}
