// C.grouped (Figma ember-chart-2.js): grouped vertical bars over a y grid; one band per category, the series side by
// side inside it (2 px apart, top corners 3).
import type { Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type GroupedData = { cats: string[]; max: number; ticks: string[]; series: { name: string; tok: string; vals: number[] }[] };

export function grouped(K: Kit, p: Frame, w: number, o: GroupedData): Frame {
  const pl = K.plot(p, "grouped bars", w, K.PH);
  const yW = 36;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 8, w - yW - 8, o.cats.length, 0.5);
  const k = o.series.length;
  for (let i = 0; i < o.cats.length; i++) {
    const b = bs[i];
    const g = 2, bw = Math.floor((b.w - (k - 1) * g) / k);
    o.series.forEach((s, j) => {
      const h = K.h(s.vals[i], o.max);
      const bar = K.rect(pl, "bar · " + o.cats[i].toLowerCase() + " · " + s.name, b.x + j * (bw + g), K.BASE - h, bw, h, s.tok, [3, 3, 0, 0]);
      bar.motion = { kind: "grow", origin: "bottom", order: i * k + j, group: i };
    });
    K.xAt(pl, o.cats[i], b.x + Math.round(b.w / 2), K.PH - 14, "center");
  }
  return pl;
}
