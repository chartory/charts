// 034 Scatter (Figma chart/034): C.scatter on the 30-day return / volatility sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { scatter } from "../../plots/scatter";
import { data } from "./data";

const legend: [string, string][] = [["data/cat-1", "Layer 1"], ["data/cat-2", "DeFi"], ["data/cat-6", "Meme"]];
const group = (tok: string) => legend.find((l) => l[0] === tok)![1];
const pct = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v) + "%";
const best = [...data.pts].sort((a, b) => b[1] - a[1])[0];

/** Tooltip for one bubble (group = the token's rank by volatility, left to right): its return and volatility. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const q = [...o.pts].sort((a, b) => a[0] - b[0])[g];
  if (!q) return null;
  return { kind: "value", text: `${q[4]} (${group(q[3])}) · ${pct(q[1])} return · ${q[0]}% vol` };
}

export const def: ChartDef = {
  no: 34,
  slug: "scatter",
  legend,
  // update: the next 30 days; volatility moves ±8 points and return ±6 points per token (whole numbers, inside the
  // axes), bubble sizes move together by a few % so their order (draw order) and which bubbles carry a label stay
  update: (d, step) => {
    const o = d as typeof data;
    const k = 1 + 0.05 * Math.sin(step * 1.3);
    const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    return {
      ...o,
      pts: o.pts.map(([x, y, s, tok, label], i) => [
        cl(Math.round(x + 8 * Math.sin(step * 1.7 + i * 1.3)), o.xmin + 4, o.xmax - 4),
        cl(Math.round(y + 6 * Math.sin(step * 2.3 + i * 0.8)), o.ymin + 2, o.ymax - 2),
        +(s * k).toFixed(2), tok, label,
      ] as typeof o.pts[number]),
    };
  },
  plot: (K, p, w, d) => scatter(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Return vs volatility · 30 d",
    summary: `30-day return against volatility for ${data.pts.length} tokens in 3 groups; ${best[4]} has the highest return at ${pct(best[1])} with ${best[0]}% volatility.`,
    table: { head: ["Token", "Group", "Volatility", "Return", "Bubble size"], rows: data.pts.map((q) => [q[4], group(q[3]), q[0] + "%", pct(q[1]), q[2]]) },
  },
};
