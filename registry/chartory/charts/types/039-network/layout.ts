// 039 Network (Figma chart/039): C.network2; no legend (every node is named beside it).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { network2 } from "../../plots/network2";
import { data } from "./data";

const tot = data.nodes.reduce((a, x) => a + x.v, 0);
const pct = (v: number) => Math.round((v / tot) * 100) + "%";

/** Tooltip for one tool (group = the tool's node and edge): its calls and their share of all calls. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const n = o.nodes[g];
  if (!n) return null;
  const all = o.nodes.reduce((a, x) => a + x.v, 0);
  return { kind: "cell", caps: `${o.hub} · ${n.label}`.toUpperCase(), value: n.text, unit: "calls", swatch: n.tok, share: Math.round((n.v / all) * 100) + "% OF ALL CALLS" };
}

export const def: ChartDef = {
  no: 39,
  slug: "network",
  legend: null,
  // update: next week's calls; each tool moves ±5 % around a shared ±8 % swing (order kept, so every tool keeps its
  // place), the shown count is one decimal in K and the share is recomputed in the plot
  update: (d, step) => {
    const o = d as typeof data;
    const k = 1 + 0.08 * Math.sin(step * 2.3 + 0.5);
    return {
      ...o,
      nodes: o.nodes.map((n, i) => {
        const v = +(n.v * k * (1 + 0.05 * Math.sin(step * 1.7 + i * 1.9))).toFixed(1);
        return { ...n, v, text: v.toFixed(1) + "K" };
      }),
    };
  },
  plot: (K, p, w, d) => network2(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Agent tool calls",
    summary: `Tool calls by the ${data.hub} agent this week across ${data.nodes.length} tools: ${data.nodes[0].label} leads with ${data.nodes[0].text} (${pct(data.nodes[0].v)}), ${data.nodes[data.nodes.length - 1].label} is lowest with ${data.nodes[data.nodes.length - 1].text}.`,
    table: { head: ["Tool", "Calls", "Share"], rows: data.nodes.map((n) => [n.label, n.text, pct(n.v)]) },
  },
};
