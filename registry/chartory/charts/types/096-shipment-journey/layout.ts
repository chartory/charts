// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 096 Shipment journey (Figma chart/096): C.journey on shipment 4471, legend = the transport phases.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { journey } from "../../plots/journey";
import { data } from "./data";

const PHASE = ["Warehouse", "Sea", "Customs", "Road"];

/** Later today and the next days: the shipment moves on by road (now advances, still before out for delivery). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const now = +(d.now + 0.8 * step).toFixed(1);
  return { ...d, now, phases: d.phases.map((p, i): [number, number, string] => (i === d.phases.length - 1 ? [p[0], now, p[2]] : p)) };
}

/** Hover: one event (stem, dot, name and date): its date, done or expected. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, e = d.events[g];
  if (!e) return null;
  const date = e.date.replace(" · ETA", "").replace(/^(\w)(\w+)/, (_, a: string, b: string) => a + b.toLowerCase());
  return { kind: "value", text: `${e.label} · ${date} · ${e.t <= d.now ? "done" : "ETA"}` };
}

export const def: ChartDef = {
  no: 96,
  slug: "shipment-journey",
  legend: [["data/cat-2", "Warehouse"], ["data/primary", "Sea"], ["status/warning", "Customs"], ["data/cat-3", "Road"]],
  plot: (K, p, w, d) => journey(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Shipment 4471 journey",
    summary: `Shipment from Oct 1, now on day ${data.now} of ${data.t1}: ${data.phases.map(([a, b], i) => `${PHASE[i]} ${+(b - a).toFixed(1)} d`).join(", ")}; out for delivery Oct 13 and delivered Oct 14 are estimates.`,
    table: { head: ["Event", "Date", "Status"], rows: data.events.map((e) => [e.label, e.date.replace(" · ETA", ""), e.t <= data.now ? "Done" : "Expected"]) },
  },
};
