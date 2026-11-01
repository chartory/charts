// 005 Floating range bars (Figma chart/005-floating-range-bars): C.floating on delivery windows per route.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { floating } from "../../plots/floating";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const hm = (v: number) => String(Math.floor(v)).padStart(2, "0") + ":" + String(Math.round((v % 1) * 60)).padStart(2, "0");
const over = data.vals.filter(([lo]) => lo >= data.sla).length;

/** Hover tooltip: one route's window (latest, median, earliest) in the bar's SLA colour. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, [lo, hi, med] = o.vals[g], within = lo < o.sla, tok = within ? "data/primary" : "status/warning";
  return {
    kind: "range",
    caps: `ROUTE ${o.cats[g]} · ${within ? "WITHIN" : "OVER"} SLA`,
    rows: [
      { label: "Latest", value: hm(hi), swatch: tok },
      { label: "Median", value: hm(med), swatch: "text/strong" },
      { label: "Earliest", value: hm(lo), swatch: tok },
    ],
  };
};

export const def: ChartDef = {
  no: 5,
  slug: "floating-range-bars",
  legend: [["data/primary", "Within SLA"], ["status/warning", "Over SLA"]],
  plot: (K, p, w, d) => floating(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // windows shift by up to ±45 min in quarter hours; a route stays on its side of the SLA, the median inside its window
    const q = (i: number, k: number) => 0.25 * Math.round(3 * wave(i * 3 + k, step));
    return {
      ...o,
      vals: o.vals.map(([lo, hi, med], i) => {
        let l = lo + q(i, 0);
        l = lo < o.sla ? clamp(l, o.min + 0.5, o.sla - 0.25) : Math.max(l, o.sla);
        const h = clamp(Math.max(hi + q(i, 1), l + 1.5), l + 1.5, o.max - 0.25);
        const m = clamp(med + q(i, 2), l + 0.5, h - 0.5);
        return [l, h, m] as [number, number, number];
      }),
    };
  },
  describe: {
    title: "Delivery windows by route",
    summary: `Delivery window per route (earliest to latest arrival, with the median), 8 routes; ${over} routes start at or after the ${hm(data.sla)} SLA; R8 runs ${hm(data.vals[7][0])} to ${hm(data.vals[7][1])}.`,
    table: { head: ["Route", "Earliest", "Latest", "Median", "SLA"], rows: data.cats.map((c, i) => [c, hm(data.vals[i][0]), hm(data.vals[i][1]), hm(data.vals[i][2]), data.vals[i][0] < data.sla ? "Within" : "Over"]) },
  },
};
