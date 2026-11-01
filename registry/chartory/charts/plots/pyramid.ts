// C.pyramid (Figma ember-chart-5.js, type 82): back-to-back bars per row, the row label in a 60 px centre column,
// left bars grow leftwards (a), right bars rightwards (b), each with its percentage outside the bar end.
import { box, cell, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type PyramidData = { max: number; aTok: string; bTok: string; rows: { label: string; a: number; b: number }[] };

export function pyramid(K: Kit, p: Frame, w: number, o: PyramidData): Frame {
  const pl = K.plot(p, "pyramid", w, K.PH);
  const mid = Math.round(w / 2), cw = 60, k = o.rows.length, rh = Math.floor((K.PH - 4) / k), bh = rh - 8, half = mid - cw / 2 - 40;
  const s = (v: number) => Math.round((v / o.max) * half);
  for (let r = 0; r < k; r++) {
    const q = o.rows[r];
    const y = r * rh + 4;
    cell(K, pl, q.label, mid - cw / 2, y + bh / 2 - 7, cw, "Label/Caps", "body");
    box(K, pl, "left · " + q.label, mid - cw / 2 - s(q.a), y, s(q.a), bh, o.aTok, 3).motion = { kind: "grow", origin: "right", order: r, group: r };
    box(K, pl, "right · " + q.label, mid + cw / 2, y, s(q.b), bh, o.bTok, 3).motion = { kind: "grow", origin: "left", order: r, group: r };
    const ta = K.caps(pl, q.a + "%", "body");
    place(ta, mid - cw / 2 - s(q.a) - 6 - Math.ceil(ta.w), y + bh / 2 - 7);
    ta.motion = { kind: "fade", order: r, group: r, after: true };
    const tb = K.caps(pl, q.b + "%", "body");
    place(tb, mid + cw / 2 + s(q.b) + 6, y + bh / 2 - 7);
    tb.motion = { kind: "fade", order: r, group: r, after: true };
  }
  return pl;
}
