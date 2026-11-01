// 026 Cohort (Figma chart/026, "Revenue retention by cohort"): C.cohort, six monthly cohorts over six months.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { cohort } from "../../plots/cohort";
import { data } from "./data";

/** Tooltip for one cell (group = the cell's index in reading order): cohort and month, the value on its ramp step and
 *  the change from the month before. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  let i = 0;
  for (const co of o.cohorts)
    for (let c = 0; c < co.vals.length; c++, i++) {
      if (i !== g) continue;
      const v = co.vals[c], k = Math.max(1, Math.min(6, Math.ceil(((v - o.lo) / (o.hi - o.lo)) * 6))), dv = c ? v - co.vals[c - 1] : 0;
      const share = c ? (dv > 0 ? "+" : dv < 0 ? "−" : "±") + Math.abs(dv) + " PTS VS " + o.cols[c - 1] : "COHORT START";
      return { kind: "cell", caps: (co.label + " · " + o.cols[c]).toUpperCase(), value: o.fmt(v), unit: "retained", swatch: "data/seq-" + k, share };
    }
  return null;
}

export const def: ChartDef = {
  no: 26,
  slug: "cohort",
  legend: [["data/seq-1", "Lower"], ["data/seq-6", "Higher"]],
  // update: the next month's revision of the same cohorts (each value moves 1–4 points, M0 stays 100, retention
  // never rises along a cohort, values stay inside the ramp's lo..hi)
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      cohorts: o.cohorts.map((c, r) => {
        const vals: number[] = [];
        c.vals.forEach((v, i) => {
          const nv = i === 0 ? v : Math.round(v + 3 * Math.sin(step * 1.9 + r * 1.3 + i * 0.7));
          vals.push(Math.max(o.lo + 1, Math.min(i === 0 ? o.hi : vals[i - 1], nv)));
        });
        return { ...c, vals };
      }),
    };
  },
  plot: (K, p, w, d) => cohort(K, p, w, { ...((d as typeof data | undefined) ?? data), yW: w > 480 ? 72 : 64 }),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Revenue retention by cohort",
    summary: "Net revenue retention by monthly cohort, April to September: month 2 retention runs from 86% (April) to 91% (July); the April cohort keeps 80% at month 5.",
    table: {
      head: ["Cohort", "Accounts", ...data.cols],
      rows: data.cohorts.map((c) => {
        const [m, n] = c.label.split(" · ");
        return [m[0] + m.slice(1).toLowerCase(), +n, ...data.cols.map((_, i) => (i < c.vals.length ? data.fmt(c.vals[i]) : ""))];
      }),
    },
  },
};
