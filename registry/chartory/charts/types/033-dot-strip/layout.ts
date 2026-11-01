// 033 Dot strip (Figma chart/033): C.strips; no legend (rails are labelled).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { strips } from "../../plots/strips";
import { data } from "./data";

const range = (r: (typeof data.rows)[number]) => { const v = r.pts.map((q) => q[0]); return [Math.min(...v), Math.max(...v)] as const; };
const first = data.rows[0], last = data.rows[data.rows.length - 1];

/** Tooltip for one rail (group = the rail's range and payouts): slowest, median and fastest payout. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  const v = r.pts.map((q) => q[0]).sort((a, b) => a - b), m = v.length >> 1;
  const med = v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2, days = (x: number) => o.fmt(x) + " days";
  return {
    kind: "range", caps: `${r.label.toUpperCase()} · ${v.length} PAYOUTS`,
    rows: [{ label: "Slowest", value: days(v[v.length - 1]), swatch: "data/primary" }, { label: "Median", value: days(med), swatch: "data/primary" }, { label: "Fastest", value: days(v[0]), swatch: "data/primary" }],
  };
}

export const def: ChartDef = {
  no: 33,
  slug: "dot-strip",
  legend: null,
  // update: the next 30 days; each rail speeds up or slows down by 5–15 % as a whole, each payout a little more on
  // top, inside the axis (0–8 days); dot sizes stay, the low / high labels follow the new range
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      rows: o.rows.map((r, ri) => {
        const k = 1 + 0.1 * Math.sin(step * 1.8 + ri * 1.1) + 0.05 * Math.sign(Math.sin(step * 1.8 + ri * 1.1));
        return { ...r, pts: r.pts.map(([v, s], i) => [Math.max(o.min + 0.05, Math.min(o.max - 0.3, v * k * (1 + 0.06 * Math.sin(step * 2.9 + i * 1.7)))), s] as [number, number]) };
      }),
    };
  },
  plot: (K, p, w, d) => strips(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Payout time by rail",
    summary: `Payout time in days for ${data.rows.length} rails over the last 30 days: ${first.label} pays out in ${data.fmt(range(first)[0])} to ${data.fmt(range(first)[1])} days, ${last.label} in ${data.fmt(range(last)[0])} to ${data.fmt(range(last)[1])} days.`,
    table: { head: ["Rail", "Fastest (days)", "Slowest (days)", "Sample payouts"], rows: data.rows.map((r) => [r.label, data.fmt(range(r)[0]), data.fmt(range(r)[1]), r.pts.length]) },
  },
};
