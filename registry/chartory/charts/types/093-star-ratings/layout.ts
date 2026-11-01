// 093 Star ratings (Figma chart/093): C.ratings; no legend (the bars are labelled by star level).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { ratings } from "../../plots/ratings";
import { data } from "./data";

const total = data.rows.reduce((a, r) => a + r[1], 0);

/** A later 90 days: review counts move, the average (one decimal, as shown) recomputed from them. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const rows = d.rows.map(([s, n], i): [number, number] => [s, Math.round(n * (1 + 0.2 * Math.sin(i * 2.1 + step * 1.7 + 0.4)))]);
  const avg = +(rows.reduce((a, [s, n]) => a + s * n, 0) / rows.reduce((a, r) => a + r[1], 0)).toFixed(1);
  return { ...d, rows, avg: Math.min(4.9, Math.max(4.1, avg)) };
}

/** Hover: one star level (its bar and count): reviews and their share of all reviews. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const rows = (d0 as typeof data).rows, r = rows[g];
  if (!r) return null;
  const all = rows.reduce((a, x) => a + x[1], 0);
  return { kind: "value", text: `${r[0]} star · ${r[1].toLocaleString("en-US")} reviews · ${Math.round((100 * r[1]) / all)}%` };
}

export const def: ChartDef = {
  no: 93,
  slug: "star-ratings",
  legend: null,
  plot: (K, p, w, d) => ratings(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Review ratings",
    summary: `${total.toLocaleString("en-US")} reviews with an average of ${data.avg.toFixed(1)} stars: ${data.rows.map(([s, n]) => `${s} star ${n.toLocaleString("en-US")}`).join(", ")}.`,
    table: { head: ["Rating", "Reviews"], rows: data.rows.map(([s, n]) => [`${s} star`, n]) },
  },
};
