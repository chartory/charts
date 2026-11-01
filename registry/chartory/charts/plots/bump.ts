// C.bump (Figma ember-chart-3.js): rank over time; a grid row per rank (#1 on top), smooth lines through the ranks,
// ringed points, the focus row thicker and fully opaque (others 55 %), names at the line ends.
import { X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type BumpData = { cols: string[]; rows: { label: string; tok: string; ranks: number[] }[]; focus?: string };

export function bump(K: Kit, p: Frame, w: number, o: BumpData): Frame {
  const pl = K.plot(p, "bump", w, K.PH);
  const n = o.cols.length, k = o.rows.length;
  const x0 = 40, x1 = w - 86;
  const top = 10, step = Math.floor((K.PH - 40) / (k - 1));
  const y = (r: number) => top + (r - 1) * step;
  for (let r = 1; r <= k; r++) {
    K.rect(pl, "row · " + r, x0, y(r), x1 - x0, 1, "grid");
    const t = K.caps(pl, "#" + r, "axis"); t.name = "rank · " + r; t.x = 0; t.y = y(r) - 7;
  }
  for (const row of o.rows) {
    const pts = row.ranks.map((r, i) => [X(i, n, x0, x1), y(r)] as [number, number]);
    const f = row.label === o.focus;
    const ri = o.rows.indexOf(row);
    const ln = K.vec(pl, "line · " + row.label.toLowerCase(), K.path(pts, true), { stroke: row.tok, sw: f ? 3 : 2 });
    if (!f && o.focus) ln.opacity = 0.55;
    ln.motion = { kind: "draw", order: ri, group: ri };
    pts.forEach(([px, py], i) => {
      const d = K.ring(pl, "dot · " + row.label.toLowerCase(), px, py, f ? 12 : 10, row.tok);
      d.sw = 2; d.x = Math.round(d.x); d.y = Math.round(d.y);
      d.motion = { kind: "pop", order: i, group: ri, after: true };
    });
    const lb = K.T(pl, "Body/S", row.label, f ? "strong" : "body");
    lb.motion = { kind: "fade", order: ri, group: ri, after: true };
    lb.name = "name · " + row.label.toLowerCase(); lb.x = x1 + 14; lb.y = pts[n - 1][1] - Math.round(lb.h / 2);
  }
  for (let i = 0; i < n; i++) K.xAt(pl, o.cols[i], X(i, n, x0, x1), K.PH - 14, "center");
  return pl;
}
