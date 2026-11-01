// 023 Radar (Figma chart/023, "Model comparison"): C.radar, two models on six eval axes.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { radar } from "../../plots/radar";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const [kite, atlas] = data.series;
const cap = (s: string) => s[0] + s.slice(1).toLowerCase();

/** Hover tooltip: one model's shape, its score on every axis. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, s = o.series[g];
  return {
    kind: "range",
    caps: s.name.toUpperCase() + " · EVAL SCORES",
    rows: o.axes.map((a, i) => ({ label: cap(a), value: String(s.vals[i]), swatch: s.tok })),
  };
};

export const def: ChartDef = {
  no: 23,
  slug: "radar",
  legend: [["data/primary", "Atlas 3"], ["data/cat-2", "Kite 2 Pro"]],
  plot: (K, p, w, d) => radar(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later eval runs: each score moves up to ±6 points (whole scores), inside 20–98
    return { ...o, series: o.series.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => clamp(v + Math.round(6 * wave(i + j * 6, step)), 20, 98)) })) };
  },
  describe: {
    title: "Model comparison",
    summary: `Eval scores out of 100 on six axes: Atlas 3 scores ${atlas.vals[0]} on reasoning against ${kite.vals[0]} for Kite 2 Pro; Kite 2 Pro leads on code (${kite.vals[1]}), tool use, speed and cost.`,
    table: { head: ["Axis", "Atlas 3", "Kite 2 Pro"], rows: data.axes.map((a, i) => [cap(a), atlas.vals[i], kite.vals[i]]) },
  },
};
