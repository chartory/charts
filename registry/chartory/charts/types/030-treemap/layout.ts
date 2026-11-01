// 030 Treemap (Figma chart/030): C.treemap on the category mix sample.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { treemap } from "../../plots/treemap";
import { data } from "./data";

const tot = (g: (typeof data.groups)[number]) => g.items.reduce((s, i) => s + i[1], 0);
const all = data.groups.reduce((s, g) => s + tot(g), 0);
const top = [...data.groups].sort((a, b) => tot(b) - tot(a))[0];

// The squarified layout sits close to the label thresholds (48 × 22, value from 38 high) at every size, so the update
// takes the first candidate move (largest first) that keeps every variant's marks.
const shape = (d: unknown) => (["xs", "s", "m", "l"] as Size[]).flatMap((s) => [true, false].map((lg) => buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" ? m.style : m.name)).join("\n"))).join("\n\n");
let base: string | undefined;
const keep = <T>(make: (a: number, gk: number) => T): T => {
  base ??= shape(data);
  for (const gk of [1, 0.8, 0.6, 0.5]) for (const a of [1, 0.75, 0.5, 0.35, 0.25, 0.15, 0]) { const c = make(a, gk); if (shape(c) === base) return c; }
  return make(0, 0);
};

/** Tooltip for one tile (group = the tile's place in drawing order: categories by total, items by value): the item,
 *  its sales and its share of its category. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const sum = (x: (typeof o.groups)[number]) => x.items.reduce((s, i) => s + i[1], 0);
  let k = 0;
  for (const grp of [...o.groups].sort((a, b) => sum(b) - sum(a)))
    for (const [label, v] of [...grp.items].sort((a, b) => b[1] - a[1])) {
      if (k++ !== g) continue;
      return { kind: "cell", caps: `${grp.name} · ${label}`.toUpperCase(), value: o.fmt ? o.fmt(v) : String(v), swatch: grp.tok, share: `${Math.round((v / sum(grp)) * 100)}% OF ${grp.name.toUpperCase()}` };
    }
  return null;
}

export const def: ChartDef = {
  no: 30,
  slug: "treemap",
  legend: [["data/cat-1", "Apparel"], ["data/cat-2", "Home"], ["data/cat-3", "Beauty"], ["data/cat-5", "Outdoor"]],
  // update: the next quarter; sales move up to 10 % overall, each category up to ±10 % on top and each item ±4 %
  // (whole $K), as far as every size keeps the same tiles and labels (see keep)
  update: (d, step) => {
    const o = d as typeof data;
    return keep((a, gk) => ({
      ...o,
      groups: o.groups.map((g, gi) => {
        const k = (1 + gk * (step % 2 ? 0.1 : -0.08)) * (1 + a * 0.1 * Math.sin(step * 1.9 + gi * 2.4));
        return { ...g, items: g.items.map(([l, v], i) => [l, Math.round(v * k * (1 + a * 0.04 * Math.sin(step * 2.7 + i * 1.3)))] as [string, number]) };
      }),
    }));
  },
  plot: (K, p, w, d) => treemap(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Sales by category",
    summary: `Q3 net sales of $${all}K across ${data.groups.length} categories and ${data.groups.reduce((s, g) => s + g.items.length, 0)} subcategories; ${top.name} is the largest at $${tot(top)}K, led by ${top.items[0][0]} at $${top.items[0][1]}K.`,
    table: { head: ["Category", "Subcategory", "Net sales"], rows: data.groups.flatMap((g) => g.items.map(([l, v]) => [g.name, l, "$" + v + "K"])) },
  },
};
