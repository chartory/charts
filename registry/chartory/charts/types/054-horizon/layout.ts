// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 054 Horizon (Figma chart/054, "FX volatility"): C.horizon, four currency pairs over 60 days, 3 bands of 1 each.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { horizon } from "../../plots/horizon";
import { data } from "./data";

const f = (v: number) => (v > 0 ? "+" : "") + v.toFixed(2);

const r3 = (v: number) => Math.round(v * 1000) / 1000;

// tooltip: one currency pair's row (group = row): its high, low and last value against the average
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g];
  if (!r || !r.vals.length) return null;
  const hi = Math.max(...r.vals), lo = Math.min(...r.vals), last = r.vals[r.vals.length - 1];
  const tok = (v: number) => (v > 0 ? "data/primary" : "data/cat-2");
  const sg = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2);
  return { kind: "range", caps: r.label.toUpperCase(), rows: [{ label: "High", value: sg(hi), swatch: tok(hi) }, { label: "Low", value: sg(lo), swatch: tok(lo) }, { label: "Last", value: sg(last), swatch: tok(last) }] };
};

export const def: ChartDef = {
  no: 54,
  slug: "horizon",
  legend: [["data/primary", "Above average"], ["data/cat-2", "Below average"]],
  plot: (K, p, w, d) => horizon(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next 60 days: every value moves up to ±12 % (sign kept, inside the three bands)
  update: (d, step) => {
    const o = d as typeof data, top = 3 * o.band;
    return { ...o, rows: o.rows.map((r, k) => ({ ...r, vals: r.vals.map((v, i) => Math.max(-top, Math.min(top, r3(v * (1 + 0.12 * Math.sin(i * 0.21 + k * 1.7 + step * 2.3)))))) })) };
  },
  describe: {
    title: "FX volatility",
    summary: `Daily volatility against its average for ${data.rows.length} currency pairs from Aug 11 to Oct 9: ${data.rows.map((r) => `${r.label} ends at ${f(r.vals[r.vals.length - 1])}`).join(", ")}; USD / JPY peaks at ${f(Math.max(...data.rows[2].vals))}.`,
    table: { head: ["Day", ...data.rows.map((r) => r.label)], rows: data.rows[0].vals.map((_, i) => [i + 1, ...data.rows.map((r) => f(r.vals[i]))]) },
  },
};
