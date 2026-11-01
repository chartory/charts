// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 078 Battery cells (Figma chart/078): C.batteries on the van fleet; no legend (each cell is labelled).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { batteries } from "../../plots/batteries";
import { data } from "./data";

const low = data.items.filter((q) => q.v < 25);
const km = (s: string) => s.replace(" KM", " km");

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** A later reading: each van's charge moves inside its status band, the range follows the van's own km per %. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  return {
    items: d.items.map((q, i) => {
      const [lo, hi] = q.v < 25 ? [5, 24] : q.v < 50 ? [25, 49] : [50, 98];
      const v = Math.min(hi, Math.max(lo, Math.round(q.v * (1 + 0.16 * wob(i, step)))));
      const kmPer = parseInt(q.sub, 10) / q.v;
      return { ...q, v, sub: Math.round(kmPer * v) + " KM" };
    }),
  };
}

/** Hover: one van (its charge bar and caps line): charge, range, charging. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const q = (d0 as typeof data).items[g];
  return q ? { kind: "value", text: `${q.label} · ${q.v}% · ${km(q.sub)}${q.charging ? " · charging" : ""}` } : null;
}

export const def: ChartDef = {
  no: 78,
  slug: "battery-cells",
  legend: null,
  plot: (K, p, w, d) => batteries(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Fleet charge",
    summary: `Charge of ${data.items.length} vans: ${low.length} under 25% (${low.map((q) => q.label + " " + q.v + "%").join(", ")}), ${data.items.filter((q) => q.charging).length} charging.`,
    table: { head: ["Van", "Charge", "Range", "Charging"], rows: data.items.map((q) => [q.label, q.v + "%", km(q.sub), q.charging ? "Yes" : "No"]) },
  },
};
