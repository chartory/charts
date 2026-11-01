// 051 Spiral year (Figma chart/051, "Weekly active workspaces"): C.spiral, 52 weeks on 2.5 turns, the busiest ringed.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { spiral } from "../../plots/spiral";
import { data } from "./data";

const pct = (v: number) => Math.round(v * 100) + "%";

const r2 = (v: number) => Math.round(v * 100) / 100;

// tooltip: one week dot (group = week index)
const tip = (o: typeof data, g: number): TooltipSpec | null => (o.vals[g] == null ? null : { kind: "value", text: "W" + (g + 1) + " · " + pct(o.vals[g]) });

export const def: ChartDef = {
  no: 51,
  slug: "spiral-year",
  legend: [["data/seq-2", "Quiet week"], ["data/seq-4", "Typical"], ["data/seq-6", "Busy week"]],
  flatXs: true,
  plot: (K, p, w, d) => spiral(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // a later year: every week moves up to ±12 %; the busiest week (ringed) and the quietest keep their place
  update: (d, step) => {
    const o = d as typeof data, top = o.vals.indexOf(Math.max(...o.vals)), low = o.vals.indexOf(Math.min(...o.vals));
    const lo = o.vals[low] + 0.05, hi = o.vals[top] - 0.03;
    return { ...o, vals: o.vals.map((v, i) => (i === top || i === low ? v : Math.min(hi, Math.max(lo, r2(v * (1 + 0.12 * Math.sin(i * 0.9 + step * 1.7))))))) };
  },
  describe: {
    title: "Year in activity",
    summary: `Weekly active workspaces over ${data.vals.length} weeks as a share of the busiest week: week 11 (launch) is the busiest at ${pct(Math.max(...data.vals))}, week 1 (new year) the quietest at ${pct(Math.min(...data.vals))}, with a 9-week streak above 2K.`,
    table: { head: ["Week", "Share of busiest week"], rows: data.vals.map((v, i) => ["W" + (i + 1), pct(v)]) },
  },
};
