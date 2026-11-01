// 049 Parallel coordinates (Figma chart/049): C.parallel on the model eval sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { parallel } from "../../plots/parallel";
import { data } from "./data";

const axis = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const focus = data.rows.find((r) => r.label === data.focus)!;

/** Tooltip for one model (group = its line, with points for the focus model): its score on every measure. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  return { kind: "series", caps: `${r.label.toUpperCase()} · SCORE / 100`, rows: o.axes.map((a, i) => ({ label: axis(a), value: String(r.vals[i]), swatch: r.tok })) };
}

export const def: ChartDef = {
  no: 49,
  slug: "parallel-coordinates",
  legend: [["data/primary", "Atlas 3"], ["data/cat-2", "Kite 2 Pro"], ["data/cat-3", "Orion XL"], ["data/cat-4", "Vega 1.5"], ["data/cat-5", "Nova"]],
  // update: the next eval run; every score moves up to ±8 points (whole numbers, 0–100)
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, rows: o.rows.map((r, ri) => ({ ...r, vals: r.vals.map((v, i) => Math.max(1, Math.min(99, Math.round(v + 8 * Math.sin(step * 1.7 + ri * 1.3 + i * 0.9))))) })) };
  },
  plot: (K, p, w, d) => parallel(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Model trade-offs",
    summary: `Eval scores out of 100 for ${data.rows.length} models on ${data.axes.length} measures; ${focus.label} scores ${data.axes.map((a, i) => `${focus.vals[i]} on ${axis(a).toLowerCase()}`).join(", ")}.`,
    table: { head: ["Model", ...data.axes.map(axis)], rows: data.rows.map((r) => [r.label, ...r.vals]) },
  },
};
