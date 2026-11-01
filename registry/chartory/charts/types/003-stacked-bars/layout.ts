// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 003 Stacked bars (Figma chart/003-stacked-bars): C.vStack on the weekly failed-payments sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { vStack } from "../../plots/v-stack";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);

const n = data.stacks[0].vals.length;
const week = (i: number) => "W" + (27 + i);
const total = (i: number) => data.stacks.reduce((a, s) => a + s.vals[i], 0);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Hover tooltip: one week's stack, a row per reason and the week total. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data;
  return {
    kind: "series",
    caps: week(g) + " · FAILED PAYMENTS",
    rows: o.stacks.map((s) => ({ label: cap(s.name), value: s.vals[g].toLocaleString("en-US"), swatch: s.tok })),
    total: { label: "Total", value: o.stacks.reduce((a, s) => a + s.vals[g], 0).toLocaleString("en-US") },
  };
};

export const def: ChartDef = {
  no: 3,
  slug: "stacked-bars",
  legend: [["data/cat-1", "Card declined"], ["data/cat-2", "Insufficient funds"], ["data/cat-3", "Fraud block"]],
  plot: (K, p, w, d) => vStack(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // each reason moves ±12 % per week; a column whose total would pass 590 is scaled back under the 600 axis
    const stacks = o.stacks.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => Math.max(1, Math.round(v * (1 + 0.12 * wave(i + j * 5, step))))) }));
    for (let i = 0; i < stacks[0].vals.length; i++) {
      const t = stacks.reduce((a, s) => a + s.vals[i], 0);
      if (t > 590) for (const s of stacks) s.vals[i] = Math.floor((s.vals[i] * 590) / t);
    }
    return { ...o, stacks };
  },
  describe: {
    title: "Failed payments by reason",
    summary: `Failed payments per week by reason, W27 to W40: ${total(0)} in W27, ${total(n - 1)} in W40 (${data.stacks.map((s) => s.vals[n - 1] + " " + s.name).join(", ")}).`,
    table: {
      head: ["Week", ...data.stacks.map((s) => cap(s.name)), "Total"],
      rows: Array.from({ length: n }, (_, i) => [week(i), ...data.stacks.map((s) => s.vals[i]), total(i)]),
    },
  },
};
