// 012 Multi-line (Figma chart/012-multi-line): C.multiLine on p95 latency per region.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { multiLine } from "../../plots/multi-line";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

const names = ["US-East", "EU-West", "AP-South", "SA-East"];
const ms = (v: number) => Math.round(v);

/** Hover tooltip: one region's line over the 24 hours (now, peak, low). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const s = (d as typeof data).series[g];
  return {
    kind: "range",
    caps: names[g].toUpperCase() + " · P95 · 24 H",
    rows: [
      { label: "Now", value: ms(s.vals[s.vals.length - 1]) + " ms", swatch: s.tok },
      { label: "Peak", value: ms(Math.max(...s.vals)) + " ms", swatch: s.tok },
      { label: "Low", value: ms(Math.min(...s.vals)) + " ms", swatch: s.tok },
    ],
  };
};

export const def: ChartDef = {
  no: 12,
  slug: "multi-line",
  legend: [["data/cat-1", "US-East"], ["data/cat-2", "EU-West"], ["data/cat-3", "AP-South"], ["data/cat-4", "SA-East"]],
  plot: (K, p, w, d) => multiLine(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later days: each region drifts ±8 % on a slow swell plus ±4 % per hour, inside the 900 ms axis
    return { ...o, series: o.series.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => clamp(r2(v * (1 + 0.08 * Math.sin(i * 0.4 + step * 1.9 + j * 1.3) + 0.04 * wave(i + j * 7, step))), 20, 880)) })) };
  },
  describe: {
    title: "Latency by region",
    summary: `P95 time to first token per hour over the last 24 hours, 4 regions; now: ${names.map((n, j) => `${n} ${ms(data.series[j].vals[23])} ms`).join(", ")}.`,
    table: { head: ["Hour", ...names.map((n) => n + " (ms)")], rows: data.series[0].vals.map((_, i) => [String(i).padStart(2, "0") + ":00", ...data.series.map((s) => ms(s.vals[i]))]) },
  },
};
