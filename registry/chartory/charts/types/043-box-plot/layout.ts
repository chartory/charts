// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 043 Box plot (Figma chart/043): C.boxPlot on the model latency sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { boxPlot } from "../../plots/box-plot";
import { data } from "./data";

const name = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const byMedian = [...data.rows].sort((a, b) => a.q[2] - b.q[2]);
const lo = byMedian[0], hi = byMedian[byMedian.length - 1];

/** Tooltip for one model (group = its whisker, caps, box, median and outliers): the five quartiles and outliers. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  const [mn, q1, md, q3, mx] = r.q, ms = (v: number) => v + " ms";
  const rows = [
    { label: "Max", value: ms(mx), swatch: "text/action" }, { label: "Q3", value: ms(q3), swatch: "data/primary" }, { label: "Median", value: ms(md), swatch: "text/strong" },
    { label: "Q1", value: ms(q1), swatch: "data/primary" }, { label: "Min", value: ms(mn), swatch: "text/action" },
  ];
  if (r.out?.length) rows.push({ label: r.out.length > 1 ? "Outliers" : "Outlier", value: r.out.join(", ") + " ms", swatch: "text/action" });
  return { kind: "range", caps: r.label + " · LATENCY", rows };
}

export const def: ChartDef = {
  no: 43,
  slug: "box-plot",
  legend: [["data/primary", "Middle 50%"], ["text/strong", "Median"], ["text/action", "Range and outliers"]],
  // update: the next 7 days; each model gets faster or slower by up to ±12 % (all five quartiles and its outliers
  // alike, whole 10 ms), kept under the axis top
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      rows: o.rows.map((r, i) => {
        const top = Math.max(...r.q, ...(r.out ?? []));
        const k = Math.min(1 + 0.12 * Math.sin(step * 1.9 + i * 1.7), (o.max - 20) / top);
        const m = (v: number) => Math.round((v * k) / 10) * 10;
        return { ...r, q: r.q.map(m) as typeof r.q, out: r.out?.map(m) };
      }),
    };
  },
  plot: (K, p, w, d) => boxPlot(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Latency spread by model",
    summary: `Response latency over the last 7 days for ${data.rows.length} models: median from ${lo.q[2]} ms (${name(lo.label)}) to ${hi.q[2]} ms (${name(hi.label)}).`,
    table: {
      head: ["Model", "Min (ms)", "Q1 (ms)", "Median (ms)", "Q3 (ms)", "Max (ms)", "Outliers (ms)"],
      rows: data.rows.map((r) => [name(r.label), ...r.q, (r.out ?? []).join(", ")]),
    },
  },
};
