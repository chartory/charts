// C.candles (Figma ember-chart.js): candlesticks over a y grid (wick 1 px, body radius 1, coloured by direction),
// a volume strip under them at 40 %, and a dashed 7-period moving average of the close.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type CandlesData = { c: [number, number, number, number, number][]; min: number; max: number; ticks: string[]; xl: Record<number, string>; vmax: number };

export function candles(K: Kit, p: Frame, w: number, o: CandlesData): Frame {
  const pl = K.plot(p, "candles", w, K.PH);
  const T0 = K.TOP, B0 = K.BASE;
  const volH = 32, xlH = 22;
  K.BASE = K.PH - xlH - volH - 8;
  K.yGrid(pl, o.ticks, 40, w);
  const n = o.c.length, bs = K.bands(44, w - 44, n, 0.35);
  const Y = (v: number) => K.yMap(v, o.min, o.max);
  const vb = K.PH - xlH;
  for (let i = 0; i < n; i++) {
    const [op, hi, lo, cl, vol] = o.c[i];
    const up = cl >= op, tok = up ? "status/success" : "status/danger";
    const cx = bs[i].x + Math.floor(bs[i].w / 2);
    K.rect(pl, "wick " + (i + 1), cx, Y(hi), 1, Math.max(1, Y(lo) - Y(hi)), tok).motion = { kind: "fade", order: i, group: i };
    const y1 = Math.min(Y(op), Y(cl));
    K.rect(pl, "body " + (i + 1), bs[i].x, y1, bs[i].w, Math.max(1, Math.abs(Y(op) - Y(cl))), tok, 1).motion = { kind: "fade", order: i, group: i };
    const vh = Math.max(1, Math.round((vol / o.vmax) * volH));
    const v = K.rect(pl, "volume " + (i + 1), bs[i].x, vb - vh, bs[i].w, vh, tok);
    v.opacity = 0.4;
    v.motion = { kind: "grow", origin: "bottom", order: i, group: i };
  }
  const ma = o.c.map((_, i) => { const s = o.c.slice(Math.max(0, i - 6), i + 1); return s.reduce((a, q) => a + q[3], 0) / s.length; });
  const pts = ma.map((v, i) => [bs[i].x + Math.floor(bs[i].w / 2), Y(v)] as [number, number]);
  const ln = K.vec(pl, "moving average · 7", K.path(pts, true), { stroke: "text/action", sw: 1.5 });
  ln.dash = [4, 3];
  ln.motion = { kind: "draw", order: n, after: true };
  for (const [i, t] of Object.entries(o.xl)) { const k = +i; K.xAt(pl, t, bs[k].x + Math.floor(bs[k].w / 2), K.PH - 14, "center"); }
  K.TOP = T0; K.BASE = B0;
  return pl;
}
