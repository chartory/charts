// 100 Split calendar (Figma chart/100): C.splitCal on September's bank feed. Radius-bound (the side list sets the size).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { splitCal } from "../../plots/split-cal";
import { data } from "./data";

const sum = (k: 0 | 1) => data.days.reduce((a, d) => a + d[k], 0);

const MON = "Sep ";
/** Another month's feed on the same calendar: amounts move (whole $K, quiet days kept), the side list recomputed. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const days = d.days.map(([a, b], i): [number, number] => [a && Math.max(1, Math.min(d.max, Math.round(a * (1 + 0.18 * Math.sin(i * 2.1 + step * 1.7))))), b && Math.max(1, Math.min(d.max, Math.round(b * (1 + 0.18 * Math.sin(i * 1.3 + step * 2.3 + 1)))))]);
  const big = (k: 0 | 1) => days.reduce((m, x, i) => (x[k] > days[m][k] ? i : m), 0);
  const bi = big(0), bo = big(1);
  return {
    ...d, days,
    rows: [{ ...d.rows[0], text: MON + (bi + 1), pct: "$" + days[bi][0] + "K" }, { ...d.rows[1], text: MON + (bo + 1), pct: "$" + days[bo][1] + "K" }, { ...d.rows[2], text: String(days.filter((x) => !x[0]).length) }],
  };
}

const WD = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const usd = (v: number) => "$" + v + "K";
/** Hover: one day (its in and out triangles): cash in, cash out, the day's net. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, x = d.days[g];
  if (!x) return null;
  const net = x[0] - x[1];
  return {
    kind: "series", caps: `SEP ${g + 1} · ${WD[(g + d.start) % 7]} · NET ${net < 0 ? "−" : "+"}${usd(Math.abs(net))}`,
    rows: [{ label: "Cash in", value: usd(x[0]), swatch: "status/success" }, { label: "Cash out", value: usd(x[1]), swatch: "status/danger" }],
  };
}

export const def: ChartDef = {
  no: 100,
  slug: "split-calendar",
  legend: [["status/success", "Cash in"], ["status/danger", "Cash out"]],
  flat: ["s"],
  plot: (K, p, w, d) => splitCal(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Daily cash in and out, September",
    summary: `Cash in and out per day in September: $${sum(0)}K in, $${sum(1)}K out; the biggest day in is Sep 15 ($164K), the biggest day out Sep 30 ($178K).`,
    table: { head: ["Day", "In ($K)", "Out ($K)"], rows: data.days.map(([a, b], i) => [`Sep ${i + 1}`, a, b]) },
  },
};
