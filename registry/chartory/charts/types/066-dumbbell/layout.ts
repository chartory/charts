// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 066 Dumbbell (Figma chart/066, "Price position"): C.dumbbell, our price against the rival's on 6 products.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { dumbbell } from "../../plots/dumbbell";
import { data } from "./data";

const gap = (a: number, b: number) => (a - b > 0 ? "+$" : "−$") + Math.abs(a - b);
const cheaper = data.rows.filter((r) => r.a <= r.b).length;

// tooltip: one product row (group = row): our price against the rival's, tone = the gap bar's colour
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g];
  if (!r) return null;
  return { kind: "compare", caps: r.label.toUpperCase() + " · OUR PRICE", value: "$" + r.a, delta: { text: gap(r.a, r.b), tone: r.a <= r.b ? "success" : "danger" }, comparison: "VS RIVAL $" + r.b };
};

export const def: ChartDef = {
  no: 66,
  slug: "dumbbell",
  legend: [["data/primary", "Our price"], ["data/cat-2", "Rival price"]],
  plot: (K, p, w, d) => dumbbell(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next price check: both prices move a few dollars (never equal, inside the axis); the gaps are recomputed by the plot
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      rows: o.rows.map((r, k) => {
        const a = Math.min(o.max, Math.max(o.min + 1, r.a + Math.round(4 * Math.sin(k * 1.9 + step * 2.3))));
        const b = Math.min(o.max, Math.max(o.min + 1, r.b + Math.round(5 * Math.sin(k * 1.1 + step * 1.7 + 1))));
        return { ...r, a: a === b ? a - 1 : a, b };
      }),
    };
  },
  describe: {
    title: "Price watch",
    summary: `Our price is lower than the rival's on ${cheaper} of ${data.rows.length} products; the widest gaps are −$10 (Trail runner, Fleece mid) and +$7 (Rain shell).`,
    table: { head: ["Product", "Our price", "Rival price", "Gap"], rows: data.rows.map((r) => [r.label, "$" + r.a, "$" + r.b, gap(r.a, r.b)]) },
  },
};
