// C.funnel (Figma ember-chart.js): stacked trapezoids, centred, top width W0 × widths[i] narrowing to the next stage;
// name and value centred on each stage, the step conversion beside it (dropped when it would leave the plot).
import type { Kit } from "../core/kit";
import { collection, layout, remove, type Frame } from "../core/node";

/** Signal: the kit's drawing, its stages on one ramp (strongest first) instead of a category per stage (token names
 *  only; the core maps them to the Signal tokens) */
const FUNNEL_RAMP = ["data/cat-1", "data/cat-2", "data/cat-3", "data/cat-4", "data/cat-5", "data/cat-10"];

export type FunnelData = { widths: number[]; stages: { label: string; text: string; tok: string; conv?: string }[] };

export function funnel(K: Kit, p: Frame, w: number, o: FunnelData): Frame {
  // Signal: the same drawing, its stages on one ramp (strongest first) instead of a category per stage
  if (collection.signal) o = { ...o, stages: o.stages.map((s, i) => ({ ...s, tok: FUNNEL_RAMP[Math.min(i, 5)] })) };
  const pl = K.plot(p, "funnel", w, K.PH);
  const n = o.stages.length, g = 4;
  const h = Math.floor((K.PH - (n - 1) * g) / n);
  const W0 = Math.min(w, 400);
  const cx = Math.round(w / 2);
  for (let i = 0; i < n; i++) {
    const s = o.stages[i];
    const wt = Math.round(W0 * o.widths[i]), wb = Math.round(W0 * (o.widths[i + 1] ?? o.widths[i] * 0.85));
    const y = i * (h + g);
    K.vec(pl, "stage · " + s.label.toLowerCase(), "M " + (cx - wt / 2) + " " + y + " L " + (cx + wt / 2) + " " + y + " L " + (cx + wb / 2) + " " + (y + h) + " L " + (cx - wb / 2) + " " + (y + h) + " Z", { fill: s.tok })
      .motion = { kind: "reveal", order: i, group: i };
    const t = K.AL(pl, "label · " + s.label.toLowerCase(), "HORIZONTAL", { gap: 8, cross: "CENTER" });
    const mo = { kind: "fade" as const, order: i, group: i, after: true };
    K.T(t, "Label/S", s.label, "strong").motion = mo;
    K.T(t, "Label/S", s.text, "strong").motion = mo;
    layout(t);
    t.x = cx - Math.round(t.w / 2); t.y = y + Math.round((h - t.h) / 2);
    if (s.conv) {
      const c = K.caps(pl, s.conv, "axis");
      c.x = cx + Math.round(wt / 2) + 10; c.y = y + Math.round((h - 14) / 2);
      c.motion = mo;
      if (c.x + c.w > w) remove(c);
    }
  }
  return pl;
}
