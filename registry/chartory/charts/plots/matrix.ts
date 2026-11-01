// C.matrix (Figma ember-chart.js): a cluster matrix: size rows (labels left, a rule under each row), cells in a
// 16-column band grid coloured by cluster (weak cells at 0.55), and an optional crosshair with a tooltip.
import type { Kit } from "../core/kit";
import { layout, text, type Frame } from "../core/node";

export type MatrixData = { rows: string[]; ncols: number; cells: [number, number, string, boolean][]; cross?: { r: number; c: number; text: string }; yW?: number };

export function matrix(K: Kit, p: Frame, w: number, o: MatrixData): Frame {
  const pl = K.plot(p, "matrix", w, K.PH);
  const yW = o.yW ?? 36, g = 2, cx = K.bands(yW, w - yW, o.ncols, 0.08), n = o.rows.length;
  const rh = Math.floor((K.PH - (n - 1) * g) / n);
  for (let r = 0; r < n; r++) {
    const y = r * (rh + g);
    const t = K.caps(pl, o.rows[r], "axis");
    t.x = yW - 8 - Math.ceil(t.w); t.y = y + Math.round((rh - 14) / 2);
    K.rect(pl, "row-line " + String(r + 1).padStart(2, "0"), yW, y + rh, w - yW, 1, "grid");
  }
  // cells fade in reading order (left to right, top to bottom)
  const rank = o.cells.map(([r, c], i) => ({ i, k: r * o.ncols + c })).sort((a, b) => a.k - b.k).map((x) => x.i);
  o.cells.forEach(([r, c, tok, strong], i) => {
    const b = K.rect(pl, "cell " + o.rows[r].toLowerCase() + " · " + (c + 1), cx[c].x, r * (rh + g), cx[c].w, rh, tok, 3);
    if (!strong) b.opacity = 0.55;
    b.motion = { kind: "fade", order: rank.indexOf(i), group: i };
  });
  if (o.cross) {
    const { r, c } = o.cross, x = cx[c].x + Math.floor(cx[c].w / 2), y = r * (rh + g) + Math.floor(rh / 2);
    const after = { kind: "fade" as const, order: o.cells.length, after: true };
    const v = K.rect(pl, "crosshair · x", x, 0, 1, K.PH, "text/strong"); v.opacity = 0.35; v.motion = after;
    const hz = K.rect(pl, "crosshair · y", yW, y, w - yW, 1, "text/strong"); hz.opacity = 0.35; hz.motion = after;
    const tp = K.AL(pl, "tooltip", "HORIZONTAL", { pl: 8, pr: 8, cross: "CENTER" });
    K.fixH(tp, 24); tp.fill = { tok: "surface/inverse" }; tp.radius = 6; tp.motion = after;
    text(tp, "Label/S", o.cross.text, { tok: "text/inverse" }).motion = after;
    layout(tp);
    tp.x = x + 8; tp.y = y - 12;
    if (tp.x + tp.w > w) tp.x = x - 8 - Math.ceil(tp.w);
  }
  return pl;
}
