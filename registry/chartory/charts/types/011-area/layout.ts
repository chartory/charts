// 011 Area (Figma chart/011-area): C.line with a gradient area and an end point; no legend (one series).
import type { ChartDef } from "../../core/shell";
import { line } from "../../plots/line";
import { tickSeries } from "../../core/vary";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Day labels for the table: Sep 10 → Oct 9 (30 days).
const day = (i: number) => (i < 21 ? `Sep ${10 + i}` : `Oct ${i - 20}`);
const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

export const def: ChartDef = {
  no: 11,
  slug: "area",
  legend: null,
  plot: (K, p, w, d) => line(K, p, w, (d as typeof data | undefined) ?? data),
  // live: one point per tick
  tick: (d, step) => { const o = d as typeof data; return { ...o, vals: tickSeries(o.vals, step + 1, o.min, o.max) }; },
  update: (d, step) => {
    const o = d as typeof data;
    // later windows: each close moves ±30 with a slow swell and a drift that builds to the latest day, inside 3.2K–3.5K
    return { ...o, vals: o.vals.map((v, i) => clamp(v + 22 * wave(i, step) + 18 * Math.sin(step * 1.9 + i * 0.35) + (12 * step * i) / (o.vals.length - 1), o.min + 5, o.max - 5)) };
  },
  describe: {
    title: "Daily close",
    summary: `Daily close from Sep 10 to Oct 9: from ${fmt(data.vals[0])} to ${fmt(data.vals[data.vals.length - 1])}.`,
    table: { head: ["Day", "Close"], rows: data.vals.map((v, i) => [day(i), fmt(v)]) },
  },
};
