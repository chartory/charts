// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 010 Line (Figma chart/010-line): C.line with a flat area and a ringed point per hour; no legend (one series).
import type { ChartDef } from "../../core/shell";
import { line } from "../../plots/line";
import { tickSeries } from "../../core/vary";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

const hour = (i: number) => (i === data.vals.length - 1 ? "Now" : String(i).padStart(2, "0") + ":00");
const s = (v: number) => v.toFixed(2) + " s";

export const def: ChartDef = {
  no: 10,
  slug: "line",
  legend: null,
  plot: (K, p, w, d) => line(K, p, w, (d as typeof data | undefined) ?? data),
  // live: one point per tick
  tick: (d, step) => { const o = d as typeof data; return { ...o, vals: tickSeries(o.vals, step + 1, o.min, o.max) }; },
  update: (d, step) => {
    const o = d as typeof data;
    // later days: each hour moves ±12 % (to the cent of a second), inside the 1.8 s axis
    return { ...o, vals: o.vals.map((v, i) => clamp(r2(v * (1 + 0.12 * wave(i, step))), 0.3, 1.75)) };
  },
  describe: {
    title: "P95 latency, us-east",
    summary: `P95 time to first token in us-east, hourly over the last 24 hours: ${s(data.vals[data.vals.length - 1])} now, peak ${s(Math.max(...data.vals))}, low ${s(Math.min(...data.vals))}.`,
    table: { head: ["Hour", "P95"], rows: data.vals.map((v, i) => [hour(i), s(v)]) },
  },
};
