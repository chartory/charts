// 044 Slope (Figma chart/044): C.slope on the channel conversion sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { slope } from "../../plots/slope";
import { data } from "./data";

const up = data.rows.filter((r) => r.b >= r.a), down = data.rows.filter((r) => r.b < r.a);

/** Tooltip for one channel (group = its line, dots and labels): the right-hand month against the left-hand one. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  const d = Math.round((r.b - r.a) * 10) / 10;
  return {
    kind: "compare", caps: `${r.label.toUpperCase()} · ${o.right}`, value: o.fmt(r.b),
    delta: { text: (d > 0 ? "+" : d < 0 ? "−" : "±") + Math.abs(d).toFixed(1) + " pts", tone: r.b >= r.a ? "success" : "danger" }, comparison: `VS ${o.left} ${o.fmt(r.a)}`,
  };
}

export const def: ChartDef = {
  no: 44,
  slug: "slope",
  legend: [["status/success", "Improved"], ["status/danger", "Declined"]],
  // update: a revised read of both months; each channel moves ±0.4 points per month (one decimal, inside the axis),
  // the direction (improved / declined) is kept
  update: (d, step) => {
    const o = d as typeof data;
    const cl = (v: number) => Math.round(Math.max(o.min + 0.1, Math.min(o.max - 0.1, v)) * 10) / 10;
    return {
      ...o,
      rows: o.rows.map((r, i) => {
        const a = cl(r.a + 0.4 * Math.sin(step * 1.7 + i * 1.3));
        let b = cl(r.b + 0.4 * Math.sin(step * 2.3 + i * 0.9));
        if (r.b >= r.a && b < a) b = a;
        if (r.b < r.a && b >= a) b = cl(a - 0.1);
        return { ...r, a, b };
      }),
    };
  },
  plot: (K, p, w, d) => slope(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Conversion by channel, September to October",
    summary: `Store conversion by channel: ${up.length} of ${data.rows.length} channels improved, ${data.rows[0].label} from ${data.fmt(data.rows[0].a)} to ${data.fmt(data.rows[0].b)}; ${down.map((r) => `${r.label} fell from ${data.fmt(r.a)} to ${data.fmt(r.b)}`).join(", ")}.`,
    table: { head: ["Channel", "September", "October"], rows: data.rows.map((r) => [r.label, data.fmt(r.a), data.fmt(r.b)]) },
  },
};
