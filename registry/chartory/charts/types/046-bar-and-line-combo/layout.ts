// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 046 Bar and line combo (Figma chart/046): C.combo on the new MRR and churn sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { combo } from "../../plots/combo";
import { data } from "./data";

const month = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const last = data.cats.length - 1;

/** Tooltip for one month (group = its bar and its churn point): new MRR and churn rate. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  if (g < 0 || g >= o.cats.length) return null;
  return {
    kind: "series", caps: o.cats[g],
    rows: [{ label: "New MRR", value: "$" + o.bars.vals[g] + "K", swatch: o.bars.tok }, { label: "Churn rate", value: o.line.vals[g] + "%", swatch: o.line.tok }],
  };
}

export const def: ChartDef = {
  no: 46,
  slug: "bar-and-line-combo",
  legend: [["data/primary", "New MRR"], ["data/cat-2", "Churn rate"]],
  // update: revised months; new MRR moves ±12 % (whole $K, under the 60K top) and churn ±0.3 points (one decimal,
  // under 3 %)
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      bars: { ...o.bars, vals: o.bars.vals.map((v, i) => Math.min(o.bars.max - 2, Math.round(v * (1 + 0.12 * Math.sin(step * 1.9 + i * 0.8))))) },
      line: { ...o.line, vals: o.line.vals.map((v, i) => Math.max(0.2, Math.min(o.line.max - 0.1, Math.round((v + 0.3 * Math.sin(step * 2.4 + i * 1.1)) * 10) / 10))) },
    };
  },
  plot: (K, p, w, d) => combo(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "New MRR and churn, 2026",
    summary: `New MRR from $${data.bars.vals[0]}K in ${month(data.cats[0])} to $${data.bars.vals[last]}K in ${month(data.cats[last])}; monthly churn from ${data.line.vals[0]}% to ${data.line.vals[last]}%.`,
    table: { head: ["Month", "New MRR", "Churn rate"], rows: data.cats.map((c, i) => [month(c), "$" + data.bars.vals[i] + "K", data.line.vals[i] + "%"]) },
  },
};
