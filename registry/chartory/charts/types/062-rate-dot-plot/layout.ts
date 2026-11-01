// 062 Rate dot plot (Figma chart/062, "Rate projections"): C.rateDots, each member's year-end policy rate.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { rateDots } from "../../plots/rate-dots";
import { data } from "./data";

const median = (d: number[]) => [...d].sort((a, b) => a - b)[Math.floor(d.length / 2)];
const pct = (v: number) => v.toFixed(3) + "%";
const name = (l: string) => (l === "LONGER RUN" ? "Longer run" : l);

// tooltip: one period column (group = column): the members' highest, median (the plot's bar) and lowest projection
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const c = o.cols[g];
  if (!c || !c.dots.length) return null;
  return {
    kind: "range",
    caps: c.label + " · " + c.dots.length + " MEMBERS",
    rows: [
      { label: "Highest", value: pct(Math.max(...c.dots)), swatch: "data/primary" },
      { label: "Median", value: pct(median(c.dots)), swatch: "text/strong" },
      { label: "Lowest", value: pct(Math.min(...c.dots)), swatch: "data/primary" },
    ],
  };
};

export const def: ChartDef = {
  no: 62,
  slug: "rate-dot-plot",
  legend: [["data/primary", "Member view"], ["text/strong", "Median"]],
  plot: (K, p, w, d) => rateDots(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next round: some members move their projection by 25 bp (kept on the axis)
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, cols: o.cols.map((c, k) => ({ ...c, dots: c.dots.map((v, i) => Math.min(o.max - 0.25, Math.max(o.min + 0.25, v + 0.25 * Math.round(1.2 * Math.sin(i * 2.3 + k * 1.1 + step * 1.7))))) })) };
  },
  describe: {
    title: "Policy rate path",
    summary: `Year-end policy rate projections of ${data.cols[0].dots.length} members; the median falls from ${pct(median(data.cols[0].dots))} in 2026 to ${pct(median(data.cols[2].dots))} in 2028 and ${pct(median(data.cols[3].dots))} in the longer run.`,
    table: { head: ["Period", "Median", "Lowest", "Highest", "Members"], rows: data.cols.map((c) => [name(c.label), pct(median(c.dots)), pct(Math.min(...c.dots)), pct(Math.max(...c.dots)), c.dots.length]) },
  },
};
