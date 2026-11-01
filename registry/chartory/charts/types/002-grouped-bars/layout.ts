// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 002 Grouped bars (Figma chart/002-grouped-bars): C.grouped on new paid accounts by plan.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { grouped } from "../../plots/grouped";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const total = (j: number) => data.series[j].vals.reduce((a, b) => a + b, 0);

/** Hover tooltip: one month's three plan bars, with the month total. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data;
  const name = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    kind: "series",
    caps: o.cats[g] + " · NEW ACCOUNTS",
    rows: o.series.map((s) => ({ label: name(s.name), value: s.vals[g].toLocaleString("en-US"), swatch: s.tok })),
    total: { label: "Total", value: o.series.reduce((a, s) => a + s.vals[g], 0).toLocaleString("en-US") },
  };
};

export const def: ChartDef = {
  no: 2,
  slug: "grouped-bars",
  legend: [["data/cat-1", "Starter"], ["data/cat-2", "Team"], ["data/cat-3", "Business"]],
  plot: (K, p, w, d) => grouped(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later half-years: signups grow ~4 % a period with a ±10 % swing per month and plan, inside the 600 axis
    return { ...o, series: o.series.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => clamp(Math.round(v * (1 + 0.04 * step + 0.1 * wave(i * 3 + j, step))), 40, 590)) })) };
  },
  describe: {
    title: "Signups by plan",
    summary: `New paid accounts per month by plan, July to December 2026: Starter ${total(0).toLocaleString("en-US")}, Team ${total(1).toLocaleString("en-US")}, Business ${total(2)}; December has Starter ${data.series[0].vals[5]}, Team ${data.series[1].vals[5]} and Business ${data.series[2].vals[5]}.`,
    table: { head: ["Month", "Starter", "Team", "Business"], rows: data.cats.map((c, i) => [c, ...data.series.map((s) => s.vals[i])]) },
  },
};
