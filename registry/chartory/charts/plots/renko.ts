// C.renko (Figma ember-chart-4.js, type 56): fixed-size price bricks over a y grid, one per move (U up, D down):
// up bricks solid status/success, down bricks status/danger at 25 % with a 1 px outline.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type RenkoData = { start: number; size: number; moves: string; min: number; max: number; ticks: string[]; xl: Record<number, string> };

export function renko(K: Kit, p: Frame, w: number, o: RenkoData): Frame {
  const pl = K.plot(p, "renko", w, K.PH);
  const yW = 44;
  K.yGrid(pl, o.ticks, yW, w);
  const n = o.moves.length, bw = Math.floor((w - yW - 8 - (n - 1) * 2) / n);
  let pr = o.start;
  const xs = (i: number) => yW + 8 + i * (bw + 2);
  for (let i = 0; i < n; i++) {
    const up = o.moves[i] === "U";
    const lo = up ? pr : pr - o.size, hi = up ? pr + o.size : pr;
    pr = up ? hi : lo;
    const y0 = K.yMap(hi, o.min, o.max), y1 = K.yMap(lo, o.min, o.max);
    // down bricks: a fill layer at node opacity 0.25 under a full-strength outline (as the Figma kit, 2026-10-13)
    if (!up) {
      const f = K.rect(pl, "brick " + (i + 1) + " · fill", xs(i), y0, bw, y1 - y0 - 1, "status/danger", 2);
      f.opacity = 0.25;
      f.motion = { kind: "grow", origin: "top", order: i, group: i };
    }
    const b = K.rect(pl, "brick " + (i + 1), xs(i), y0, bw, y1 - y0 - 1, up ? "status/success" : null, 2);
    if (!up) { b.stroke = { tok: "status/danger" }; b.sw = 1; b.align = "inside"; }
    // bricks lay left to right: up bricks rise from their foot, down bricks drop from their top
    b.motion = { kind: "grow", origin: up ? "bottom" : "top", order: i, group: i };
  }
  for (const [i, t] of Object.entries(o.xl)) { const kk = +i; K.xAt(pl, t, xs(kk) + Math.round(bw / 2), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center"); }
  return pl;
}
