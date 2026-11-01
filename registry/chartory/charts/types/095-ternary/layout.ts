// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 095 Ternary (Figma chart/095): C.ternary; no legend (every model is named beside its dot).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { ternary } from "../../plots/ternary";
import { data } from "./data";

const pct = (v: number) => Math.round(v * 100) + "%";

/** After a release cycle: each model's mix shifts by a few points (shares still sum to 1). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  return {
    ...d,
    pts: d.pts.map((q, i) => {
      const a = +Math.max(0.04, q.a + 0.05 * Math.sin(i * 2.1 + step * 1.7)).toFixed(2);
      const b = +Math.max(0.04, q.b + 0.05 * Math.sin(i * 1.3 + step * 2.3 + 1)).toFixed(2);
      return { ...q, a, b, c: +(1 - a - b).toFixed(2) };
    }),
  };
}

/** Hover: one model (dot and name): its quality / speed / low-cost mix. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const q = (d0 as typeof data).pts[g];
  return q ? { kind: "value", text: `${q.label} · quality ${pct(q.a)} · speed ${pct(q.b)} · cost ${pct(q.c)}` } : null;
}

export const def: ChartDef = {
  no: 95,
  slug: "ternary",
  legend: null,
  plot: (K, p, w, d) => ternary(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Model trade space",
    summary: `${data.pts.length} production models by their mix of quality, speed and low cost: ${data.pts.map((q) => `${q.label} ${pct(q.a)} / ${pct(q.b)} / ${pct(q.c)}`).join(", ")}.`,
    table: { head: ["Model", "Quality", "Speed", "Low cost"], rows: data.pts.map((q) => [q.label, pct(q.a), pct(q.b), pct(q.c)]) },
  },
};
