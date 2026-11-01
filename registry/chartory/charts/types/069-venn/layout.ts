// 069 Venn (Figma chart/069, "Feature overlap"): C.venn, accounts by the features they use.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { venn } from "../../plots/venn";
import { data } from "./data";

const R = data.regions;

const num = (s: string) => +s.replace(/,/g, "");
const fmt = (v: number) => v.toLocaleString("en-US");

// tooltip: one feature's circle (group = set): its accounts by region (only this feature, with each other one, all
// three), adding up to the set's total
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const s = o.sets[g], row = o.rows[g];
  if (!s || !row) return null;
  const k = "abc"[g], [i, j] = [0, 1, 2].filter((x) => x !== g);
  const pair = (x: number) => ([g, x].sort().map((y) => "abc"[y]).join("")) as keyof typeof o.regions;
  return {
    kind: "series",
    caps: s.label.toUpperCase() + (row.pct ? " · " + row.pct + " OF ACCOUNTS" : ""),
    rows: [
      { label: s.label + " only", value: o.regions[k as keyof typeof o.regions], swatch: s.tok },
      { label: "With " + o.sets[i].label, value: o.regions[pair(i)], swatch: o.sets[i].tok },
      { label: "With " + o.sets[j].label, value: o.regions[pair(j)], swatch: o.sets[j].tok },
      { label: "All three", value: o.regions.abc, swatch: "text/strong" },
    ],
    total: { label: "Accounts", value: row.text },
  };
};

export const def: ChartDef = {
  no: 69,
  slug: "venn",
  legend: null,
  plot: (K, p, w, d) => venn(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next month: every region's count moves up to ±8 % (to the nearest 10); set totals and shares are recomputed
  update: (d, step) => {
    const o = d as typeof data;
    const keys = ["a", "b", "c", "ab", "ac", "bc", "abc"] as const;
    const v = Object.fromEntries(keys.map((k, i) => [k, Math.round((num(o.regions[k]) * (1 + 0.08 * Math.sin(i * 1.6 + step * 2.1))) / 10) * 10])) as Record<(typeof keys)[number], number>;
    const all = keys.reduce((a, k) => a + v[k], 0);
    const tot = [v.a + v.ab + v.ac + v.abc, v.b + v.ab + v.bc + v.abc, v.c + v.ac + v.bc + v.abc];
    return {
      ...o,
      regions: Object.fromEntries(keys.map((k) => [k, fmt(v[k])])) as typeof o.regions,
      rows: o.rows.map((r, i) => ({ ...r, text: fmt(tot[i]), pct: Math.round((tot[i] / all) * 100) + "%" })),
    };
  },
  describe: {
    title: "Feature adoption",
    summary: `3,590 accounts by feature: Dashboards 2,550 (71%), Alerts 1,540 (43%), API 1,360 (38%); ${R.abc} use all three.`,
    table: {
      head: ["Features used", "Accounts"],
      rows: [
        ["Dashboards only", R.a], ["Alerts only", R.b], ["API only", R.c], ["Dashboards and Alerts", R.ab],
        ["Dashboards and API", R.ac], ["Alerts and API", R.bc], ["All three", R.abc],
      ],
    },
  },
};
