// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 064 Arc diagram (Figma chart/064, "Wallet cluster transfers"): C.arcDiagram, 7 clusters and 10 transfer links.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { arcDiagram } from "../../plots/arc-diagram";
import { data } from "./data";

const nm = (i: number) => data.nodes[i].label;
const top = [...data.links].sort((a, b) => b[2] - a[2])[0];

// tooltip: one cluster with the arcs it sends (group = source node): one row per outgoing link (swatch = the
// receiving cluster's colour), the total sent weight
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const q = o.nodes[g];
  if (!q) return null;
  const out = o.links.filter(([a]) => a === g);
  if (!out.length) return { kind: "value", text: q.label + " · volume " + q.v };
  return {
    kind: "series",
    caps: q.label + " · SENT",
    rows: out.map(([, b, v]) => ({ label: "To " + o.nodes[b].label, value: String(v), swatch: o.nodes[b].tok })),
    total: { label: "Total weight", value: String(out.reduce((s, l) => s + l[2], 0)) },
  };
};

export const def: ChartDef = {
  no: 64,
  slug: "arc-diagram",
  legend: null,
  plot: (K, p, w, d) => arcDiagram(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next week: cluster volumes and transfer weights move up to ±20 % (whole weights, at least 1)
  update: (d, step) => {
    const o = d as typeof data;
    const mv = (v: number, a: number) => Math.max(1, Math.round(v * (1 + 0.2 * Math.sin(a + step * 2))));
    return { ...o, nodes: o.nodes.map((q, i) => ({ ...q, v: mv(q.v, i * 1.5) })), links: o.links.map(([a, b, v], i) => [a, b, mv(v, i * 1.9 + 0.7)] as [number, number, number]) };
  },
  describe: {
    title: "Transfer arcs",
    summary: `${data.links.length} transfer links between ${data.nodes.length} wallet clusters; the heaviest is ${nm(top[0])} to ${nm(top[1])} with weight ${top[2]}.`,
    table: { head: ["From", "To", "Weight"], rows: data.links.map(([a, b, v]) => [nm(a), nm(b), v]) },
  },
};
