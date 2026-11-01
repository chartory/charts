// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 065 Ring grid (Figma chart/065, "Same-day dispatch"): C.ringGrid, dispatch rate for 8 sites.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { ringGrid } from "../../plots/ring-grid";
import { data } from "./data";

const below = data.items.filter((q) => q.v < data.warn).map((q) => `${q.label} ${q.v}%`);
const orders = (s: string) => s.replace(" ORDERS", "").replace("K", ",") + "00";

// tooltip: one site's ring (group = site): its rate against the good threshold, tone = the ring's colour
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const q = o.items[g];
  if (!q) return null;
  const dv = q.v - o.good, tone = q.v >= o.good ? "success" : q.v >= o.warn ? "info" : "warning";
  return { kind: "compare", caps: q.label.toUpperCase() + " · " + q.sub, value: q.v + "%", delta: { text: (dv > 0 ? "+" : dv < 0 ? "−" : "±") + Math.abs(dv) + (Math.abs(dv) === 1 ? " pt" : " pts"), tone }, comparison: "VS " + o.good + "% TARGET" };
};

export const def: ChartDef = {
  no: 65,
  slug: "ring-grid",
  legend: null,
  plot: (K, p, w, d) => ringGrid(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next day: each site's rate moves by up to 2 points (whole %, below 100)
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, items: o.items.map((q, i) => ({ ...q, v: Math.min(99, Math.max(80, q.v + Math.round(2 * Math.sin(i * 1.3 + step * 2.1)))) })) };
  },
  describe: {
    title: "Dispatch by site",
    summary: `Same-day dispatch rate for ${data.items.length} sites, from ${Math.min(...data.items.map((q) => q.v))}% to ${Math.max(...data.items.map((q) => q.v))}%; ${below.length} sites below ${data.warn}%: ${below.join(", ")}.`,
    table: { head: ["Site", "Same-day dispatch", "Orders"], rows: data.items.map((q) => [q.label, q.v + "%", orders(q.sub)]) },
  },
};
