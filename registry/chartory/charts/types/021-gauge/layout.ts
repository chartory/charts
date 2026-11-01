// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 021 Gauge (Figma chart/021): C.semiGauge; no legend (the zones are marked on the ring).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { semiGauge } from "../../plots/semi-gauge";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

/** Hover tooltip: the needle (utilisation against the overload mark, in points). */
const tip = (d: unknown): TooltipSpec => {
  const o = d as typeof data, gap = o.v - o.warn;
  return {
    kind: "compare",
    caps: `UTILISATION · ${o.center} ${o.caps} OUT`,
    value: o.v + "%",
    delta: { text: (gap < 0 ? "−" : "+") + Math.abs(gap) + (Math.abs(gap) === 1 ? " pt" : " pts"), tone: gap > 0 ? "danger" : gap >= -5 ? "warning" : "success" },
    comparison: `VS ${o.warn}% OVERLOAD`,
  };
};

export const def: ChartDef = {
  no: 21,
  slug: "gauge",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = semiGauge(K, p, w, o);
    return o === data ? pl : keepNames(pl, semiGauge(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // other hours: utilisation 74 / 79 / 84 % of the 78-van fleet (the vans out follow); the overload mark holds
    const v = [82, 74, 79, 84][Math.min(step, 3)] ?? 84;
    return { ...o, v, center: String(Math.round((78 * v) / 100)) };
  },
  describe: {
    title: "Fleet utilisation",
    summary: `Fleet utilisation is at ${data.v}% with ${data.center} vans out; overload starts above ${data.warn}%.`,
    table: { head: ["Measure", "Value"], rows: [["Utilisation", data.v + "%"], ["Overload threshold", data.warn + "%"], ["Vans", data.center ?? ""]] },
  },
};
