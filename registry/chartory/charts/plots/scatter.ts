// C.scatter (Figma ember-chart.js): bubble scatter over a y grid; bubbles sized by √(size / smax) × 44 (at least 8),
// drawn largest first at 85 % with a 1 px ground ring outside; a label inside bubbles of 28 px and more.
import { type Kit, paint } from "../core/kit";
import { collection, ellipse, type Frame } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type ScatterData = {
  pts: [number, number, number, string, string][];
  xmin: number; xmax: number; ymin: number; ymax: number; ticks: string[]; xt: [number, string][]; smax: number;
};

export function scatter(K: Kit, p: Frame, w: number, o: ScatterData): Frame {
  if (collection.signal) return signalPlot("scatter")(K, p, w, o); // Signal: charts/signal/plots/scatter.ts (@chartory/signal)
  const pl = K.plot(p, "scatter", w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const X = (v: number) => yW + 12 + Math.round(((v - o.xmin) / (o.xmax - o.xmin)) * (w - yW - 24));
  for (const [v, t] of o.xt) K.xAt(pl, t, X(v), K.PH - 14, "center");
  const byX = [...o.pts].sort((a, b) => a[0] - b[0]);
  for (const pt of [...o.pts].sort((a, b) => b[2] - a[2])) {
    const [x, y, sz, tok, label] = pt;
    const order = byX.indexOf(pt);
    const d = Math.max(8, Math.round(Math.sqrt(sz / o.smax) * 44));
    const e = ellipse(pl, "point · " + label.toLowerCase(), X(x) - Math.round(d / 2), K.yMap(y, o.ymin, o.ymax) - Math.round(d / 2), d, d,
      { fill: paint(tok), stroke: paint(K.BG), sw: 1, align: "outside" });
    e.opacity = 0.85;
    e.motion = { kind: "pop", order, group: order };
    if (d >= 28) {
      const t = K.caps(pl, label, "strong");
      t.x = e.x + Math.round((d - Math.ceil(t.w)) / 2); t.y = e.y + Math.round((d - 14) / 2);
      t.motion = { kind: "fade", order, group: order, after: true };
    }
  }
  return pl;
}
