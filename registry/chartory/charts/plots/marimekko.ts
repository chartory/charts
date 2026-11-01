// C.marimekko (Figma ember-chart-3.js): columns as wide as their share, cells as tall as their part within the
// column (2 px gaps), the part's percent inside cells that fit it; column labels "NAME NN%" under the columns, the
// name alone when that does not fit, nothing when neither does.
import { remove, type Frame } from "../core/node";
import type { Kit } from "../core/kit";

export type MarimekkoData = { toks: string[]; cols: { label: string; share: number; parts: number[] }[] };

export function marimekko(K: Kit, p: Frame, w: number, o: MarimekkoData): Frame {
  const pl = K.plot(p, "marimekko", w, K.PH);
  const g = 2, H = K.BASE - K.TOP;
  let x = 0, k = 0;
  const tot = o.cols.reduce((a, c) => a + c.share, 0);
  for (let i = 0; i < o.cols.length; i++) {
    const c = o.cols[i];
    const cw = i === o.cols.length - 1 ? w - x : Math.round((c.share / tot) * (w + g)) - g;
    const ps = c.parts.reduce((a, v) => a + v, 0);
    let y = K.TOP;
    const m = c.parts.length, avail = H - g * (m - 1);
    for (let j = 0; j < m; j++) {
      const hh = j === m - 1 ? K.BASE - y : Math.round((c.parts[j] / ps) * avail);
      K.rect(pl, "cell · " + c.label.toLowerCase() + " · " + j, x, y, cw, Math.max(2, hh), o.toks[j], 3).motion = { kind: "fade", order: k, group: i };
      const pc = Math.round((c.parts[j] / ps) * 100);
      if (hh >= 20 && cw >= 40) {
        const t = K.caps(pl, pc + "%", "strong");
        t.name = "pct"; t.x = x + 8; t.y = y + 6;
        t.motion = { kind: "fade", order: k, group: i, after: true };
      }
      k++;
      y += hh + g;
    }
    const last = i === o.cols.length - 1;
    const at = last ? x + cw : x, al = last ? "end" : "start";
    let xl = K.xAt(pl, c.label + " " + Math.round((c.share / tot) * 100) + "%", at, K.PH - 14, al);
    if (Math.ceil(xl.w) > cw - 4) {
      remove(xl);
      xl = K.xAt(pl, c.label, at, K.PH - 14, al);
      if (Math.ceil(xl.w) > cw - 4) remove(xl);
    }
    x += cw + g;
  }
  return pl;
}
