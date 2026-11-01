// 089 Drift arrows (Figma chart/089-drift-rebalance): C.driftArrows, current weight to target per asset class.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { driftArrows } from "../../plots/drift-arrows";
import { data } from "./data";

const drift = (r: { now: number; target: number }) => (r.now - r.target > 0 ? "+" : "−") + Math.abs(r.now - r.target).toFixed(1);

// drift (pt) per step for each asset class; they sum to 0 (targets and weights both sum to 100), and each stays in the
// band where its arrow shows or hides at every size as in the sample (1 pt rows 0.7–0.9, the 2 pt row 1.9–2.0)
const DRIFT = [[3.7, -4.2, -1.9, 0.8, 0.7, 0.9], [4.4, -4.8, -2, 0.7, 0.9, 0.8], [2.9, -3.4, -1.9, 0.9, 0.8, 0.7]];
/** A later month: the portfolio drifts again from the same targets. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const dr = DRIFT[(step - 1) % DRIFT.length];
  return { ...d, rows: d.rows.map((r, i) => ({ ...r, now: +(r.target + dr[i]).toFixed(1) })) };
}

/** Hover: one asset class (dot, arrow, drift): current weight against its target. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const r = (d0 as typeof data).rows[g];
  if (!r) return null;
  const dv = r.now - r.target;
  return { kind: "compare", caps: r.label.toUpperCase(), value: r.now + "%", delta: { text: drift(r) + " pt", tone: Math.abs(dv) < 0.6 ? "neutral" : dv > 0 ? "warning" : "info" }, comparison: `VS TARGET ${r.target}%` };
}

export const def: ChartDef = {
  no: 89,
  slug: "drift-arrows",
  legend: [["status/warning", "Overweight"], ["status/info", "Underweight"], ["text/strong", "Target"]],
  plot: (K, p, w, d) => driftArrows(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Allocation drift",
    summary: `Current weight against target for ${data.rows.length} asset classes: ${data.rows.map((r) => `${r.label} ${r.now}% (target ${r.target}%)`).join(", ")}.`,
    table: { head: ["Asset", "Now (%)", "Target (%)", "Drift (pt)"], rows: data.rows.map((r) => [r.label, r.now, r.target, drift(r)]) },
  },
};
