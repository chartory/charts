// 059 Shelf planogram (Figma chart/059, "Shelf availability"): C.shelf, three dairy shelves, stock per facing.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { shelf } from "../../plots/shelf";
import { data } from "./data";

const all = data.shelves.flat();
const status = (q: number) => (q <= data.out ? "Out" : q <= data.low ? "Low" : "Healthy");
const list = (s: string) => all.filter((q) => status(q.pct) === s).map((q) => q.name[0] + q.name.slice(1).toLowerCase()).join(", ");

const r2 = (v: number) => Math.round(v * 100) / 100;

// tooltip: one product facing (group = reading order over the shelves): stock level, swatch = its stock fill
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  let k = g;
  for (let s = 0; s < o.shelves.length; s++) {
    if (k >= o.shelves[s].length) { k -= o.shelves[s].length; continue; }
    const q = o.shelves[s][k];
    const out = q.pct <= o.out, low = q.pct <= o.low;
    return {
      kind: "cell",
      caps: "SHELF " + (s + 1) + " · " + q.name,
      value: Math.round(q.pct * 100) + "%",
      unit: "in stock",
      swatch: out ? "status/danger" : low ? "status/warning" : "data/primary",
      share: (out ? "OUT" : low ? "LOW" : "HEALTHY") + " · " + q.w + (q.w === 1 ? " FACING" : " FACINGS"),
    };
  }
  return null;
};

export const def: ChartDef = {
  no: 59,
  slug: "shelf-planogram",
  legend: [["data/primary", "Healthy"], ["status/warning", "Low"], ["status/danger", "Out"]],
  plot: (K, p, w, d) => shelf(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the shelf a few hours later: stock moves up to ±18 % per facing, every facing keeps its status (out / low / healthy)
  update: (d, step) => {
    const o = d as typeof data;
    let i = 0;
    const move = (q: number) => {
      const v = r2(q * (1 + 0.18 * Math.sin(i++ * 1.7 + step * 2.3)));
      return q <= o.out ? q : q <= o.low ? Math.min(o.low, Math.max(o.out + 0.04, v)) : Math.min(0.98, Math.max(o.low + 0.04, v));
    };
    return { ...o, shelves: o.shelves.map((r) => r.map((q) => ({ ...q, pct: move(q.pct) }))) };
  },
  describe: {
    title: "Shelf availability",
    summary: `Stock on ${all.length} products across ${data.shelves.length} shelves: out of stock ${list("Out")}; low (30% or less) ${list("Low")}; the rest healthy.`,
    table: { head: ["Shelf", "Product", "Facings", "Stock", "Status"], rows: data.shelves.flatMap((r, s) => r.map((q) => [s + 1, q.name, q.w, Math.round(q.pct * 100) + "%", status(q.pct)])) },
  },
};
