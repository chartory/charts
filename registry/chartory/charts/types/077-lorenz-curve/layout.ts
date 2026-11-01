// 077 Lorenz curve (Figma chart/077, "Stake concentration"): C.curveRef in lorenz mode against the equal-stake diagonal.
import type { ChartDef } from "../../core/shell";
import { curveRef } from "../../plots/curve-ref";
import { data } from "./data";

const share = (t: number) => Math.pow(t, data.k);
const pct = (v: number) => Math.round(v * 100) + "%";

/** A later epoch: stake concentrates a little more each step (k up), the chip recomputed from the curve. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const k = +(d.k + 0.22 * step).toFixed(2);
  return { ...d, k, mark: { ...d.mark, text: `TOP ${pct(1 - d.mark.x)} HOLD ${pct(1 - Math.pow(d.mark.x, k))}` } };
}

export const def: ChartDef = {
  no: 77,
  slug: "lorenz-curve",
  legend: [["status/warning", "Stake curve"], ["text/action", "Equal stake"]],
  plot: (K, p, w, d) => curveRef(K, p, w, (d as typeof data | undefined) ?? data),
  update,
  describe: {
    title: "Stake concentration",
    summary: `Cumulative share of stake against the share of holders, smallest first: the bottom 90% hold ${pct(share(0.9))}, so the top 10% hold ${pct(1 - share(0.9))}.`,
    table: { head: ["Holders (smallest first)", "Stake held", "Equal stake"], rows: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => [pct(t), pct(share(t)), pct(t)]) },
  },
};
