// 086 Punch card (Figma chart/086-punch-card-api): C.punchCard, API calls per hour of the week.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { punchCard } from "../../plots/punch-card";
import { data } from "./data";

const mx = Math.max(...data.vals.flat());
const at = data.vals.findIndex((r) => r.includes(mx));

/** A later week: every hour moves (whole thousands, at least 1), the busiest hours stay in the working day. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  return { ...d, vals: d.vals.map((row, r) => row.map((v, h) => Math.max(1, Math.round(v * (1 + 0.16 * Math.sin(r * 1.3 + h * 0.7 + step * 1.9)))))) };
}

const hh = (h: number) => String(h).padStart(2, "0") + ":00";
/** Hover: one day (its row of hour dots): busiest hour, hourly average and quietest hour (calls in thousands). */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, row = d.vals[g];
  if (!row) return null;
  const wk = Math.max(...d.vals.flat()), tok = (v: number) => (v / wk > 0.75 ? "data/primary" : "data/primary-soft");
  const hi = Math.max(...row), lo = Math.min(...row), sum = row.reduce((a, b) => a + b, 0), avg = Math.round(sum / row.length);
  return {
    kind: "range",
    caps: `${d.rows[g]} · ${sum.toLocaleString("en-US")}K CALLS`,
    rows: [{ label: "Busiest · " + hh(row.indexOf(hi)), value: hi + "K", swatch: tok(hi) }, { label: "Hourly average", value: avg + "K", swatch: tok(avg) }, { label: "Quietest · " + hh(row.indexOf(lo)), value: lo + "K", swatch: tok(lo) }],
  };
}

export const def: ChartDef = {
  no: 86,
  slug: "punch-card",
  legend: [["data/primary-soft", "Calls"], ["data/primary", "Peak hours"]],
  plot: (K, p, w, d) => punchCard(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "API calls by hour",
    summary: `API calls (thousands) per hour for each day of the last week: busiest ${data.rows[at]} ${String(data.vals[at].indexOf(mx)).padStart(2, "0")}:00 with ${mx}; weekends stay under ${Math.max(...data.vals[5], ...data.vals[6]) + 1}.`,
    table: { head: ["Day", ...Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"))], rows: data.rows.map((r, i) => [r, ...data.vals[i]]) },
  },
};
