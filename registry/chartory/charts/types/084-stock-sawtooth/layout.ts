// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 084 Stock sawtooth (Figma chart/084-sawtooth-stock): C.sawtooth on 60 days of units on hand.
import type { ChartDef } from "../../core/shell";
import { sawtooth } from "../../plots/sawtooth";
import { data } from "./data";

const start = Date.UTC(2026, 7, 11);
const day = (i: number) => new Date(start + i * 864e5).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const out = data.vals.filter((v) => v === 0).length;

/** A later 60 days: each restock cycle runs higher or lower (whole units, same arrivals, same stockout days). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  let c = 0;
  const vals = d.vals.map((v, i) => {
    if (d.arrivals.includes(i)) c++;
    return v === 0 ? 0 : Math.max(1, Math.min(d.max, Math.round(v * (1 + 0.14 * Math.sin(c * 1.9 + step * 1.3)))));
  });
  return { ...d, vals };
}

export const def: ChartDef = {
  no: 84,
  slug: "stock-sawtooth",
  legend: [["data/primary", "Units on hand"], ["status/warning", "Reorder point"], ["status/danger", "Stockout"]],
  plot: (K, p, w, d) => sawtooth(K, p, w, (d as typeof data | undefined) ?? data),
  update,
  describe: {
    title: "Stock level",
    summary: `Units on hand over ${data.vals.length} days from ${day(0)} to ${day(data.vals.length - 1)}, reorder point ${data.reorder}: ${data.arrivals.length} deliveries, one stockout of ${out} days, ${data.vals[data.vals.length - 1]} units at the end.`,
    table: { head: ["Day", "Units", "Delivery"], rows: data.vals.map((v, i) => [day(i), v, data.arrivals.includes(i) ? "yes" : ""]) },
  },
};
