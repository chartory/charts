// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 001 Bars (Figma chart/001-bars): C.vBars on the monthly spend sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { vBars } from "../../plots/vbars";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Hover tooltip: one month's bar (the open month reads "to date"). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, m = o.cats[g];
  return { kind: "value", text: `${m.charAt(0) + m.slice(1).toLowerCase()}${o.toks[g] === "data/primary" ? " to date" : ""} · $${o.fmt(o.vals[g])}` };
};

export const def: ChartDef = {
  no: 1,
  slug: "bars",
  legend: [["data/primary", "Month to date"], ["data/track", "Closed months"]],
  plot: (K, p, w, d) => vBars(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later months: spend drifts 0–10 % up with a ±10 % swing, inside the 80K axis
    return { ...o, vals: o.vals.map((v, i) => clamp(Math.round(v * (1 + 0.03 * step + 0.1 * wave(i, step))), 24, 78)) };
  },
  describe: {
    title: "Monthly card spend",
    summary: `Card spend by month, January to September, in $K. September (month to date) is ${data.fmt(data.vals[8])}; the highest month is July at ${data.fmt(Math.max(...data.vals))}.`,
    table: { head: ["Month", "Spend"], rows: data.cats.map((c, i) => [c, "$" + data.fmt(data.vals[i])]) },
  },
};
