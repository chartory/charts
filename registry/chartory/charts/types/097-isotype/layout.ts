// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 097 Isotype (Figma chart/097): C.isotype; the legend names the channels and the unit (1 box = 100).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { isotype } from "../../plots/isotype";
import { data } from "./data";

const total = data.rows.reduce((a, r) => a + r.v, 0);

/** Another week: orders per channel move inside the same box count (the last box stays partial). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  return {
    ...d,
    rows: d.rows.map((r, i) => {
      const full = Math.floor(r.v / d.unit) * d.unit, part = r.v - full;
      return { ...r, v: full + Math.min(d.unit - 5, Math.max(5, Math.round(part + 0.4 * d.unit * Math.sin(i * 2.1 + step * 1.7 + 0.4)))) };
    }),
  };
}

/** Hover: one channel (its row of boxes and count): orders and their share of the week. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const rows = (d0 as typeof data).rows, r = rows[g];
  if (!r) return null;
  const all = rows.reduce((a, x) => a + x.v, 0);
  return { kind: "value", text: `${r.label} · ${r.v.toLocaleString("en-US")} orders · ${Math.round((100 * r.v) / all)}%` };
}

export const def: ChartDef = {
  no: 97,
  slug: "isotype",
  legend: [["data/cat-1", "Web"], ["data/cat-2", "App"], ["data/cat-3", "Marketplace"], ["data/cat-5", "Retail · 1 box = 100"]],
  plot: (K, p, w, d) => isotype(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Orders by channel",
    summary: `${total.toLocaleString("en-US")} orders this week by channel, one box per ${data.unit}: ${data.rows.map((r) => `${r.label} ${r.v.toLocaleString("en-US")}`).join(", ")}.`,
    table: { head: ["Channel", "Orders"], rows: data.rows.map((r) => [r.label, r.v]) },
  },
};
