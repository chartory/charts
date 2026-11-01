// 072 Quadrant (Figma chart/072, "Product portfolio"): C.quadrant, 12 product lines by growth and margin.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { quadrant } from "../../plots/quadrant";
import { data } from "./data";

type QuadrantPoint = (typeof data.pts)[number];
const quad = (d: QuadrantPoint) => (d.x >= data.mx ? (d.y >= data.my ? "Grow" : "Fix margin") : d.y >= data.my ? "Protect" : "Review");
const pct = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v) + "%";
const n = (q: string) => data.pts.filter((d) => quad(d) === q).length;

// tooltip: one product line (group = its rank by growth, as the plot pops them left to right): growth, margin and
// revenue weight, swatch = the dot's quadrant colour
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const d = [...o.pts].sort((a, b) => a.x - b.x)[g];
  if (!d) return null;
  const q = d.x >= o.mx ? (d.y >= o.my ? "Grow" : "Fix margin") : d.y >= o.my ? "Protect" : "Review";
  const tok = d.x >= o.mx ? (d.y >= o.my ? "status/success" : "status/warning") : d.y >= o.my ? "data/primary" : "status/danger";
  return {
    kind: "range",
    caps: d.label.toUpperCase() + " · " + q.toUpperCase(),
    rows: [{ label: "Sales growth", value: pct(d.x), swatch: tok }, { label: "Gross margin", value: d.y + "%", swatch: tok }, { label: "Revenue weight", value: String(d.r), swatch: tok }],
  };
};

export const def: ChartDef = {
  no: 72,
  slug: "quadrant",
  legend: [["status/success", "Grow"], ["data/primary", "Protect"], ["status/warning", "Fix margin"], ["status/danger", "Review"]],
  plot: (K, p, w, d) => quadrant(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next quarter: every line moves a few points in growth and margin (and its revenue weight by up to 1), each
  // staying in its quadrant and on the axes
  update: (d, step) => {
    const o = d as typeof data;
    const side = (v: number, m: number) => v >= m;
    return {
      ...o,
      pts: o.pts.map((q, i) => {
        let x = Math.min(o.xmax - 4, Math.max(o.xmin + 4, q.x + Math.round(4 * Math.sin(i * 1.3 + step * 2)))), y = Math.min(o.ymax - 4, Math.max(o.ymin + 4, q.y + Math.round(3 * Math.sin(i * 0.7 + step * 1.6))));
        if (side(x, o.mx) !== side(q.x, o.mx)) x = q.x;
        if (side(y, o.my) !== side(q.y, o.my)) y = q.y;
        return { ...q, x, y, r: Math.max(3, q.r + Math.round(Math.sin(i * 2.1 + step * 1.3))) };
      }),
    };
  },
  describe: {
    title: "Portfolio map",
    summary: `${data.pts.length} product lines by sales growth and gross margin, split at ${pct(data.mx)} growth and ${data.my}% margin: ${n("Grow")} grow, ${n("Protect")} protect, ${n("Fix margin")} fix margin, ${n("Review")} review.`,
    table: { head: ["Product", "Growth", "Margin", "Quadrant"], rows: data.pts.map((d) => [d.label, pct(d.x), d.y + "%", quad(d)]) },
  },
};
