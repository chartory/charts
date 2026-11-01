// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 031 Sankey (Figma chart/031): C.sankey; no legend (sources and outcomes are labelled).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { sankey } from "../../plots/sankey";
import { data } from "./data";

const tot = data.left.reduce((s, n) => s + n.v, 0);
const fmt = (v: number) => v.toLocaleString("en-US");

/** Tooltip for one source (group = the source node and its flows): its sessions by outcome and their total. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const src = o.left[g];
  if (!src) return null;
  const rows = o.right.map((r, ri) => ({ label: r.label, value: fmt(o.flows.find((f) => f[0] === g && f[1] === ri)?.[2] ?? 0), swatch: src.tok }));
  return { kind: "series", caps: `${src.label.toUpperCase()} · SESSIONS BY OUTCOME`, rows, total: { label: "Total", value: fmt(o.flows.reduce((s, f) => s + (f[0] === g ? f[2] : 0), 0)) } };
}

export const def: ChartDef = {
  no: 31,
  slug: "sankey",
  legend: null,
  // update: next week; every flow moves up to ±12 % (whole tens of sessions) and both node columns are the sums of
  // their flows again, so the ribbons still fill the nodes and the labels match them
  update: (d, step) => {
    const o = d as typeof data;
    const flows = o.flows.map(([l, r, v], i) => [l, r, Math.round((v * (1 + 0.12 * Math.sin(step * 1.7 + i * 0.9))) / 10) * 10] as typeof o.flows[number]);
    const sum = (side: 0 | 1, i: number) => flows.reduce((s, f) => s + (f[side] === i ? f[2] : 0), 0);
    return { ...o, flows, left: o.left.map((n, i) => ({ ...n, v: sum(0, i) })), right: o.right.map((n, i) => ({ ...n, v: sum(1, i) })) };
  },
  plot: (K, p, w, d) => sankey(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Sessions to outcome",
    summary: `${fmt(tot)} sessions this week from ${data.left.length} sources; ${fmt(data.right[0].v)} ended in a purchase (${Math.round((data.right[0].v / tot) * 100)}%), ${data.left[0].label} brought the most at ${fmt(data.left[0].v)}.`,
    table: { head: ["Source", ...data.right.map((r) => r.label)], rows: data.left.map((l, li) => [l.label, ...data.right.map((_, ri) => fmt(data.flows.find((f) => f[0] === li && f[1] === ri)?.[2] ?? 0))]) },
  },
};
