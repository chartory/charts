// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 004 Diverging bars (Figma chart/004-diverging-bars): C.diverge on weekly cash in and out.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { diverge } from "../../plots/diverge";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const week = (i: number) => "W" + (29 + i);
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

/** Hover tooltip: one week's inflow and outflow bars, with the net. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, net = o.up[g] - o.down[g];
  return {
    kind: "series",
    caps: week(g) + " · CASH FLOW",
    rows: [
      { label: "Inflow", value: "$" + o.up[g] + "K", swatch: "data/primary" },
      { label: "Outflow", value: "−$" + o.down[g] + "K", swatch: "data/cat-2" },
    ],
    total: { label: "Net", value: (net < 0 ? "−$" : "$") + Math.abs(net) + "K" },
  };
};

export const def: ChartDef = {
  no: 4,
  slug: "diverging-bars",
  legend: [["data/primary", "Inflow"], ["data/cat-2", "Outflow"]],
  plot: (K, p, w, d) => diverge(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // inflow and outflow move ±12 % per week on their own rhythm, inside the ±400K axis
    const mv = (a: number[], k: number) => a.map((v, i) => clamp(Math.round(v * (1 + 0.12 * wave(i + k, step))), 40, 395));
    return { ...o, up: mv(o.up, 0), down: mv(o.down, 7) };
  },
  describe: {
    title: "Net cash flow",
    summary: `Weekly inflow (up) and outflow (down) in $K, W29 to W40: inflow totals $${sum(data.up).toLocaleString("en-US")}K, outflow $${sum(data.down).toLocaleString("en-US")}K, net $${sum(data.up) - sum(data.down)}K.`,
    table: { head: ["Week", "Inflow ($K)", "Outflow ($K)"], rows: data.up.map((u, i) => [week(i), u, data.down[i]]) },
  },
};
