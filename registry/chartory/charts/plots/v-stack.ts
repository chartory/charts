// C.vStack (Figma ember-chart.js): stacked vertical bars over a y grid; the y-axis width (20–30) is the first that
// gives an integer column fit near the gap ratio; stacks bottom → top, the top segment rounded; x labels centred on
// a three-column cell around the labelled bar.
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type VStackData = {
  max: number; ticks: string[]; labels: Record<number, string>; ratio?: number;
  stacks: { name: string; tok: string; vals: number[] }[];
};

export function vStack(K: Kit, p: Frame, w: number, o: VStackData): Frame {
  const base = K.BASE, n = o.stacks[0].vals.length;
  let yW = 20, s: ReturnType<Kit["cols"]> = null;
  for (let y = 20; y <= 30 && !s; y++) { const c = K.cols(w - y, n, o.ratio ?? 0.2); if (c && c.d < 0.12) { s = c; yW = y; } }
  if (!s) throw new Error("vStack: no column fit");
  const pl = K.plot(p, "stacked bars", w, K.PH);
  K.yGrid(pl, o.ticks, yW, w);
  for (let i = 0; i < n; i++) {
    const x = yW + i * (s.c + s.g);
    let top = base, acc = 0;
    for (let k = 0; k < o.stacks.length; k++) {
      const st = o.stacks[k];
      const y1 = base - K.h(acc + st.vals[i], o.max);
      const hh = top - y1;
      acc += st.vals[i];
      const r = K.rect(pl, "bar " + String(i + 1).padStart(2, "0") + " · " + st.name, x, y1, s.c, hh, st.tok, k === o.stacks.length - 1 ? [3, 3, 0, 0] : 0);
      // the column grows from the baseline, segment by segment
      r.motion = { kind: "grow", origin: "bottom", order: i * o.stacks.length + k, group: i };
      top = y1;
    }
    if (o.labels[i]) K.xLabel(pl, o.labels[i], x - s.g / 2 - (s.g + s.c), 3 * s.c + 3 * s.g, K.PH - 14);
  }
  return pl;
}
