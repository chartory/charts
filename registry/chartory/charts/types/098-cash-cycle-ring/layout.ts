// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 098 Cash cycle ring (Figma chart/098): C.cycleRing; no legend (the side list names the rings). Radius-bound.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { cycleRing } from "../../plots/cycle-ring";
import { data } from "./data";

/** A later quarter: inventory, receivable and payable days move; the cycle and the side list recomputed. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const f = (v: number, i: number) => Math.round(v * (1 + 0.14 * Math.sin(i * 2.1 + step * 1.7 + 0.4)));
  const dio = f(d.dio, 0), dso = f(d.dso, 1), dpo = f(d.dpo, 2);
  return {
    ...d, dio, dso, dpo,
    center: [[d.center[0][0], dio + dso - dpo + " d", d.center[0][2]], d.center[1]],
    rows: [{ ...d.rows[0], text: dio + " d" }, { ...d.rows[1], text: dso + " d" }, { ...d.rows[2], text: dpo + " d" }],
  };
}

/** Hover: one arc (inventory; receivables with the cash-back dot; payables): its days. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data;
  if (g === 0) return { kind: "value", text: `Inventory · ${d.dio} d` };
  if (g === 1) return { kind: "value", text: `Receivables · ${d.dso} d · cash back on day ${d.dio + d.dso}` };
  if (g === 2) return { kind: "value", text: `Payables · ${d.dpo} d` };
  return null;
}

export const def: ChartDef = {
  no: 98,
  slug: "cash-cycle-ring",
  legend: null,
  plot: (K, p, w, d) => cycleRing(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Cash conversion cycle, Q3 2026",
    summary: `Cash conversion cycle of ${data.dio + data.dso - data.dpo} days: ${data.dio} inventory days plus ${data.dso} receivable days, minus ${data.dpo} payable days.`,
    table: { head: ["Component", "Days"], rows: [["Inventory", data.dio], ["Receivables", data.dso], ["Payables", data.dpo], ["Cash cycle", data.dio + data.dso - data.dpo]] },
  },
};
