// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 080 Underwater drawdown (Figma chart/080-underwater-fund): C.underwater on the fund's drawdown series.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { underwater } from "../../plots/underwater";
import { data } from "./data";

const pct = (v: number) => v.toFixed(2).replace("-", "−") + "%";
const n = data.vals.length;
const sinceZero = n - 1 - data.vals.lastIndexOf(0);

/** A later run of the fund: drawdowns deepen or recover smoothly (peaks stay at 0), the max chip follows the low. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const vals = d.vals.map((v, i) => (v === 0 ? 0 : Math.max(d.min + 0.5, +(v * (1 + 0.16 * Math.sin(i / 9 + step * 1.4))).toFixed(2))));
  const low = Math.min(...vals);
  return { ...d, vals, mark: { i: vals.indexOf(low), text: "MAX " + low.toFixed(1).replace("-", "−") + "%" } };
}

/** Hover: the max drawdown marker (dot and chip): its period and depth. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data;
  return g === 1 ? { kind: "value", text: `Max drawdown · week ${d.mark.i + 1} · ${pct(d.vals[d.mark.i])}` } : null;
}

export const def: ChartDef = {
  no: 80,
  slug: "underwater-drawdown",
  legend: [["status/danger", "Drawdown"]],
  plot: (K, p, w, d) => underwater(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Drawdown from peak",
    summary: `Drawdown from the running peak over ${n} periods from January to October: deepest ${pct(data.vals[data.mark.i])} at period ${data.mark.i + 1}, now ${pct(data.vals[n - 1])}, ${sinceZero} periods since the last peak.`,
    table: { head: ["Period", "Drawdown"], rows: data.vals.map((v, i) => [i + 1, pct(v)]) },
  },
};
