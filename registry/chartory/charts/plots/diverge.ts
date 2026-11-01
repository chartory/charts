// C.diverge (Figma ember-chart-2.js): diverging columns around a zero line in the middle of the plot; inflow up
// (data/primary), outflow down (data/cat-2), y ticks on their own grid lines (zero drawn in text/action).
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type DivergeData = { max: number; ticks: [number, string][]; up: number[]; down: number[]; xl: Record<number, string> };

export function diverge(K: Kit, p: Frame, w: number, o: DivergeData): Frame {
  const pl = K.plot(p, "diverging columns", w, K.PH);
  const yW = 40;
  const mid = Math.round((K.PH - 22) / 2);
  const k = (mid - 8) / o.max;
  for (const [v, t] of o.ticks) {
    const y = mid - Math.round(v * k);
    K.rect(pl, "grid " + t, yW, y, w - yW, 1, v === 0 ? "text/action" : "grid");
    const tt = K.caps(pl, t, "axis");
    tt.x = yW - 8 - Math.ceil(tt.w); tt.y = y - 7;
  }
  const bs = K.bands(yW + 8, w - yW - 8, o.up.length, 0.6);
  for (let i = 0; i < o.up.length; i++) {
    const b = bs[i];
    const hu = Math.round(o.up[i] * k), hd = Math.round(o.down[i] * k);
    K.rect(pl, "in " + (i + 1), b.x, mid - hu, b.w, hu, "data/primary", [3, 3, 0, 0]).motion = { kind: "grow", origin: "bottom", order: i, group: i };
    K.rect(pl, "out " + (i + 1), b.x, mid + 1, b.w, hd, "data/cat-2", [0, 0, 3, 3]).motion = { kind: "grow", origin: "top", order: i, group: i };
  }
  for (const [i, t] of Object.entries(o.xl)) {
    const kk = +i;
    K.xAt(pl, t, bs[kk].x + Math.round(bs[kk].w / 2), K.PH - 14, "center");
  }
  return pl;
}
