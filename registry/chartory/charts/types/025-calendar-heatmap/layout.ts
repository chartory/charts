// 025 Calendar heatmap (Figma chart/025): C.calendar; no legend (the plot carries its LESS → MORE scale).
import type { ChartDef } from "../../core/shell";
import { calendar } from "../../plots/calendar";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const days = data.vals.flat().filter((v) => v >= 0);
const busiest = Math.max(...days);

export const def: ChartDef = {
  no: 25,
  slug: "calendar-heatmap",
  legend: null,
  plot: (K, p, w, d) => calendar(K, p, w, (d as typeof data | undefined) ?? data),
  update: (d, step) => {
    const o = d as typeof data;
    // a revised count per day: ±1 deploy (whole, 0–6); days still to come (−1) stay empty
    return { ...o, vals: o.vals.map((wk, x) => wk.map((v, dd) => (v < 0 ? v : clamp(v + Math.round(1.2 * wave(x * 7 + dd, step, 2.3)), 0, 6)))) };
  },
  describe: {
    title: "Production deploys per day",
    summary: `Deploy intensity per day over ${data.vals.length} weeks, May to September, on a 0–6 scale: ${days.filter((v) => v === 0).length} of ${days.length} days had no deploys; the busiest days reach ${busiest}.`,
    table: {
      head: ["Week", ...DAYS],
      rows: data.vals.map((wk, i) => ["Week " + (i + 1), ...wk.map((v) => (v < 0 ? "–" : v))]),
    },
  },
};
