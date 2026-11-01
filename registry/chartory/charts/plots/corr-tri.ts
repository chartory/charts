// C.corrTri (Figma ember-chart-5.js, type 85): lower triangle of a correlation matrix, a chip cell per pair and a
// dot sized by |r| (data/primary for r ≥ 0, cat-2 below), row labels left, column labels under the cells when the
// cells are 30 px or more, and the side list (C.sideList) beside it.
import { box, cell, place, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";

export type CorrTriData = {
  labels: string[]; m: number[][]; rows: Row[];
  /** the row-label column (default 40, the kit's three-letter tickers) */
  lW?: number;
  /** the side list's room (default 64) */
  listW?: number;
  /** column labels under the cells (default: when the cells are 30 px or more) */
  cols?: boolean;
};

export function corrTri(K: Kit, p: Frame, w: number, o: CorrTriData): Frame {
  const pl = K.plot(p, "correlation", w, K.PH);
  const n = o.labels.length, lW = o.lW ?? 40, cs = Math.min(Math.floor((K.PH - 20) / n), Math.floor((w - lW - 28 - (o.listW ?? 64)) / n)); // the side list keeps 64 px
  for (let i = 0; i < n; i++) {
    const t = K.caps(pl, o.labels[i], "body");
    place(t, 0, i * cs + cs / 2 - 7);
    if (o.cols ?? cs >= 30) cell(K, pl, o.labels[i], lW + i * cs, n * cs + 4, cs, "Label/Caps", "body");
  }
  let k = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      const x = lW + j * cs, y = i * cs;
      box(K, pl, "cell", x + 1, y + 1, cs - 2, cs - 2, "chipFill", 4, 0.6);
      if (i === j) continue;
      const r = o.m[i][j];
      const d = Math.max(4, 2 * Math.round((Math.abs(r) * (cs - 6)) / 2));
      const e = K.dot(pl, d, r >= 0 ? "data/primary" : "data/cat-2", "r " + o.labels[i] + "-" + o.labels[j]);
      e.x = x + Math.round((cs - d) / 2); e.y = y + Math.round((cs - d) / 2);
      e.opacity = 0.35 + 0.65 * Math.abs(r);
      e.motion = { kind: "pop", order: k++ };
    }
  K.sideList(pl, lW + n * cs + 28, w - (lW + n * cs + 28), o.rows);
  return pl;
}
