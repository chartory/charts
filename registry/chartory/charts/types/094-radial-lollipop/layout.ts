// 094 Radial lollipop (Figma chart/094-radial-hashrate): C.radialLolli2 on the hashrate sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { radialLollipop } from "../../plots/radial-lollipop";
import { data } from "./data";

/** A later look at the year: monthly hashrate moves (latest still the high), and the side list follows it. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const vals = d.vals.map((v, i) => Math.min(d.max - 12, Math.max(d.min + 5, Math.round(v * (1 + 0.035 * Math.sin(i * 2.1 + step * 1.7 + 0.4))))));
  const n = vals.length;
  vals[n - 1] = Math.min(d.max - 2, Math.max(vals[n - 1], Math.max(...vals.slice(0, -1)) + 4));
  const rev = +(1.9 * (1 + 0.06 * Math.sin(step * 2.3))).toFixed(1);
  const diff = (vals[n - 1] / 780 - 1) * 100;
  return {
    ...d,
    vals,
    rows: [
      { ...d.rows[0], text: "$" + rev.toFixed(1) + "M" },
      { ...d.rows[1], text: "$" + Math.round(48 * (rev / 1.9) / (vals[n - 1] / 812)) },
      { ...d.rows[2], text: (diff >= 0 ? "+" : "−") + Math.abs(diff).toFixed(1) + "%" },
    ],
  };
}

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
/** Hover: one month (stem and head): its hashrate against the month before. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const v = (d0 as typeof data).vals;
  if (v[g] == null) return null;
  if (g === 0) return { kind: "value", text: `${MONTHS[g]} · ${v[g]} EH/s` };
  const dv = v[g] - v[g - 1];
  return { kind: "compare", caps: MONTHS[g].toUpperCase() + " · MONTHLY AVERAGE", value: v[g] + " EH/s", delta: { text: (dv < 0 ? "−" : "+") + Math.abs(dv) + " EH/s", tone: "neutral" }, comparison: "VS " + MONTHS[g - 1].toUpperCase() };
}

export const def: ChartDef = {
  no: 94,
  slug: "radial-lollipop",
  legend: [["data/primary-soft", "Monthly average"], ["data/primary", "This month"], ["text/unselected", "Rings 600 · 700 · 800"]],
  plot: (K, p, w, d) => radialLollipop(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Network hashrate, 12 months",
    summary: `Monthly average hashrate in EH/s from November to October: from ${data.vals[0]} to ${data.vals[data.vals.length - 1]}, the highest month last.`,
    table: {
      head: ["Month", "EH/s"],
      rows: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => [m, data.vals[i]]),
    },
  },
};
