// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 083 Deal pipeline (Figma chart/083-pipeline-deals): C.pipeline, open deals per stage coloured by age.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { pipeline } from "../../plots/pipeline";
import { data } from "./data";

const age = (d: number) => (d > 45 ? "Stuck 45+ d" : d > 21 ? "Aging 21+ d" : "Fresh");
const all = data.stages.flatMap((s) => s.deals);

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** A later week: deal values are re-scoped (whole $K), ages kept; the stage totals follow in the plot. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  let k = 0;
  return { ...d, stages: d.stages.map((s) => ({ ...s, deals: s.deals.map(([v, a]): [number, number] => [Math.max(4, Math.round(v * (1 + 0.18 * wob(k++, step)))), a]) })) };
}

/** Hover: one stage (its deals and total): value per age state, the stage total. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, s = d.stages[g];
  if (!s) return null;
  const states: [string, string, (a: number) => boolean][] = [["data/cat-2", "Fresh", (a) => a <= 21], ["status/warning", "Aging 21+ d", (a) => a > 21 && a <= 45], ["status/danger", "Stuck 45+ d", (a) => a > 45]];
  const rows = states.flatMap(([swatch, label, f]) => {
    const ds = s.deals.filter((x) => f(x[1]));
    return ds.length ? [{ label: `${label} · ${ds.length}`, value: d.fmt(ds.reduce((a, x) => a + x[0], 0)), swatch }] : [];
  });
  return { kind: "series", caps: `${s.label} · ${s.deals.length} DEALS`, rows, total: { label: "Stage total", value: d.fmt(s.deals.reduce((a, x) => a + x[0], 0)) } };
}

export const def: ChartDef = {
  no: 83,
  slug: "deal-pipeline",
  legend: [["data/cat-2", "Fresh"], ["status/warning", "Aging 21+ d"], ["status/danger", "Stuck 45+ d"]],
  plot: (K, p, w, d) => pipeline(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Deal pipeline",
    summary: `${all.length} deals worth ${data.fmt(all.reduce((a, d) => a + d[0], 0))} across ${data.stages.length} stages: ${data.stages.map((s) => `${s.label.toLowerCase()} ${data.fmt(s.deals.reduce((a, d) => a + d[0], 0))}`).join(", ")}; ${all.filter((d) => d[1] > 45).length} deals stuck 45+ days.`,
    table: { head: ["Stage", "Value", "Age (days)", "State"], rows: data.stages.flatMap((s) => s.deals.map(([v, d]) => [s.label, data.fmt(v), d, age(d)])) },
  },
};
