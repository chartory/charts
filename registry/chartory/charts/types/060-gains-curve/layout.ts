// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 060 Gains curve (Figma chart/060, "Churn model lift"): C.curveRef in gains mode against the random diagonal.
import type { ChartDef } from "../../core/shell";
import { curveRef } from "../../plots/curve-ref";
import { data } from "./data";

const gain = (t: number) => 1 - Math.pow(1 - t, data.k);
const pct = (v: number) => Math.round(v * 100) + "%";

export const def: ChartDef = {
  no: 60,
  slug: "gains-curve",
  legend: [["data/primary", "Model"], ["text/action", "Random"]],
  plot: (K, p, w, d) => curveRef(K, p, w, (d as typeof data | undefined) ?? data),
  // the model retrained: the curve's steepness changes; the mark's chip is recomputed from the new curve
  update: (d, step) => {
    const o = d as typeof data, k = +(o.k + [-0.4, 0.3, 0.7][(step - 1) % 3]).toFixed(1);
    return { ...o, k, mark: { ...o.mark, text: `TOP ${pct(o.mark.x)} → ${pct(1 - Math.pow(1 - o.mark.x, k))} OF CHURNERS` } };
  },
  describe: {
    title: "Churn model lift",
    summary: `Share of churners found against the share of customers contacted, ranked by the churn model: the top 20% reach ${pct(gain(0.2))} of churners, against 20% at random.`,
    table: { head: ["Customers contacted", "Churners found (model)", "Churners found (random)"], rows: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => [pct(t), pct(gain(t)), pct(t)]) },
  },
};
