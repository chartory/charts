// C.pipeline (Figma ember-chart-5.js, type 83): one lane per stage, deals stacked from the lane foot (height by
// value, colour by age: > 45 d danger, > 21 d warning, else cat-2), the stage name on top (staggered on two rows when
// a name overflows its lane) and the stage total under the lane.
import { box, cell, overflows, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type PipelineData = { fmt: (v: number) => string; stages: { label: string; deals: [number, number][] }[] };

export function pipeline(K: Kit, p: Frame, w: number, o: PipelineData): Frame {
  const pl = K.plot(p, "pipeline", w, K.PH);
  const n = o.stages.length, g = 10, cw = Math.floor((w - (n - 1) * g) / n);
  const stag = overflows(o.stages.map((s) => s.label.toUpperCase()), cw, "Label/Caps");
  const top = stag ? 34 : 20, bottom = K.PH - 18;
  const mx = Math.max(...o.stages.map((s) => s.deals.reduce((a, d) => a + d[0], 0) + s.deals.length * 2));
  const k = (bottom - top) / mx;
  let order = 0;
  for (let i = 0; i < n; i++) {
    const s = o.stages[i];
    const x = i * (cw + g);
    if (stag) { const lw = Math.min(2 * cw + g, w - x); cell(K, pl, s.label, x, i % 2 ? 14 : 0, lw, "Label/Caps", "body", "left"); }
    else cell(K, pl, s.label, x, 0, cw, "Label/Caps", "body", "left");
    box(K, pl, "lane · " + s.label.toLowerCase(), x, top, cw, bottom - top, "chipFill", 6, 0.5);
    let y = bottom;
    for (const [v, age] of s.deals) {
      const h = Math.max(4, Math.round(v * k));
      y -= h;
      const tok = age > 45 ? "status/danger" : age > 21 ? "status/warning" : "data/cat-2";
      // deals stack up from the lane foot, stage by stage
      box(K, pl, "deal", x + 4, y, cw - 8, h, tok, 3, 0.85).motion = { kind: "grow", origin: "bottom", order: order++, group: i };
      y -= 2;
    }
    const tot = cell(K, pl, o.fmt(s.deals.reduce((a, d) => a + d[0], 0)), x, bottom + 4, cw, "Label/Caps", "strong", "left");
    tot.name = "stage total";
    tot.motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
