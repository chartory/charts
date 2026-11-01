// 076 Load plan (Figma chart/076): C.loadPlan on three outbound trucks; the legend names the goods.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { loadPlan } from "../../plots/load-plan";
import { data } from "./data";

const legend: [string, string][] = [["data/cat-2", "Ambient"], ["data/cat-3", "Chilled"], ["data/cat-5", "Fragile"], ["data/cat-9", "Returns"]];
const count = (cols: [number, string[]][], tok: string) => cols.reduce((a, c) => a + c[1].filter((t) => t === tok).length, 0);
const city = (s: string) => s.split(" · ")[1].charAt(0) + s.split(" · ")[1].slice(1).toLowerCase();
const avg = Math.round(data.trucks.reduce((a, t) => a + t.pct, 0) / data.trucks.length);

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** A later wave: pallet footprints shift a few cm, the load factor follows the floor used (same side of 85 %). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  let k = 0;
  return {
    trucks: d.trucks.map((t) => {
      const cols = t.cols.map(([bw, st]): [number, string[]] => [Math.max(20, bw + Math.round(5 * wob(k++, step))), [...st]]);
      const r = cols.reduce((a, c) => a + c[0], 0) / t.cols.reduce((a, c) => a + c[0], 0);
      const raw = Math.round(t.pct * r + 3 * wob(k, step));
      return { ...t, cols, pct: t.pct >= 85 ? Math.min(99, Math.max(86, raw)) : Math.min(84, Math.max(70, raw)) };
    }),
  };
}

/** Hover: one truck (its pallets and load factor): pallets per kind of goods, the truck's pallet total. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const t = (d0 as typeof data).trucks[g];
  if (!t) return null;
  const rows = legend.map(([tok, label]) => ({ label, value: String(count(t.cols, tok)), swatch: tok })).filter((r) => r.value !== "0");
  return { kind: "series", caps: `${t.label} · ${t.pct}% LOADED`, rows, total: { label: "Pallets", value: String(rows.reduce((a, r) => a + +r.value, 0)) } };
}

export const def: ChartDef = {
  no: 76,
  slug: "load-plan",
  legend,
  plot: (K, p, w, d) => loadPlan(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Outbound loads",
    summary: `${data.trucks.length} trucks loaded at ${data.trucks.map((t) => t.pct + "%").join(", ")} (average ${avg}%).`,
    table: {
      head: ["Truck", "Destination", "Load", ...legend.map((l) => l[1] + " pallets")],
      rows: data.trucks.map((t) => [t.label.split(" · ")[0], city(t.label), t.pct + "%", ...legend.map((l) => count(t.cols, l[0]))]),
    },
  },
};
