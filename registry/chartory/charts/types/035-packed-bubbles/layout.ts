// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 035 Packed bubbles (Figma chart/035): C.bubbles on the 24 h volume sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { bubbles } from "../../plots/bubbles";
import { data } from "./data";

const chg = (v: number) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + "%";
const up = data.items.filter((i) => i.chg >= 0).length;

/** Tooltip for one bubble (group = the asset's rank by volume, as packed): its 24 h volume and change. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const it = [...o.items].sort((a, b) => b.v - a.v)[g];
  if (!it) return null;
  return { kind: "compare", caps: `${it.label} · 24 H VOLUME`, value: "$" + it.v + "B", delta: { text: chg(it.chg), tone: it.chg >= 0 ? "success" : "danger" }, comparison: "VS PRIOR 24 H" };
}

export const def: ChartDef = {
  no: 35,
  slug: "packed-bubbles",
  legend: [["status/success", "Gainers"], ["status/danger", "Losers"]],
  // update: the next 24 h; volume moves with the market (±8 %) and a little per asset (order kept), each change moves
  // ±2.5 points (one decimal); the packing order and the label sizes stay
  update: (d, step) => {
    const o = d as typeof data;
    const k = 1 + 0.08 * Math.sin(step * 2.1);
    return {
      ...o,
      items: o.items.map((it, i) => ({
        ...it,
        v: +(it.v * k * (1 + 0.025 * Math.sin(step * 1.9 + i * 1.4))).toFixed(it.v < 1 ? 2 : 1),
        chg: +(it.chg + 2.5 * Math.sin(step * 1.3 + i * 0.9)).toFixed(1),
      })),
    };
  },
  plot: (K, p, w, d) => bubbles(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Volume by asset · 24 h",
    summary: `24 h spot volume for ${data.items.length} assets, sized by volume and coloured by change: ${data.items[0].label} leads at $${data.items[0].v}B (${chg(data.items[0].chg)}); ${up} assets gained, ${data.items.length - up} lost.`,
    table: { head: ["Asset", "Volume", "Change"], rows: data.items.map((i) => [i.label, "$" + i.v + "B", chg(i.chg)]) },
  },
};
