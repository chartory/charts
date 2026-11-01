// 091 Cluster map (Figma chart/091-clusters-tickets): C.clusters; no legend (each cluster is named on the map).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { clusters } from "../../plots/clusters";
import { data } from "./data";

const name = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** The next 7 days: same ticket sample, the topics shift and spread a little (same seed, so points travel with them). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const s = (i: number, k: number) => Math.sin(i * 2.1 + k * 1.3 + step * 1.7);
  return { ...d, clusters: d.clusters.map((c, i) => ({ ...c, cx: +(c.cx + 0.025 * s(i, 0)).toFixed(3), cy: +(c.cy + 0.03 * s(i, 1)).toFixed(3), sx: Math.round(c.sx * (1 + 0.12 * s(i, 2))), sy: Math.round(c.sy * (1 + 0.12 * s(i, 3))) })) };
}

/** Hover: one topic cluster (hull, outline, points, name): tickets shown and their share of the sample. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const cs = (d0 as typeof data).clusters, c = cs[g];
  if (!c) return null;
  const all = cs.reduce((a, x) => a + x.n, 0);
  return { kind: "value", text: `${name(c.label)} · ${c.n} tickets · ${Math.round((100 * c.n) / all)}%` };
}

export const def: ChartDef = {
  no: 91,
  slug: "cluster-map",
  legend: null,
  plot: (K, p, w, d) => clusters(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Support ticket topics",
    summary: `A sample of ${data.clusters.reduce((a, c) => a + c.n, 0)} support tickets from the last 7 days in ${data.clusters.length} topic clusters: ${data.clusters.map((c) => `${name(c.label)} ${c.n}`).join(", ")}.`,
    table: { head: ["Topic", "Tickets shown"], rows: data.clusters.map((c) => [name(c.label), c.n]) },
  },
};
