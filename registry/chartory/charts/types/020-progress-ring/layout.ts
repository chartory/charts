// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 020 Progress ring (Figma chart/020, "Token budget"): C.pie as a thin ring on a track, the share in the centre.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { pie } from "../../plots/pie";
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

/** Hover tooltip: the used arc (tokens used and the share of the budget). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, s = o.slices[g];
  return { kind: "value", text: `${o.rows[0].label} · ${o.rows[0].text} · ${Math.round((s.v / (o.of ?? 100)) * 100)}%` };
};

export const def: ChartDef = {
  no: 20,
  slug: "progress-ring",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = pie(K, p, w, o);
    return o === data ? pl : keepNames(pl, pie(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // two days later per step (day 21 → 23, 25, 27 of 30): usage, remaining, the forecast at reset and the days left
    const day = 21 + 2 * step, used = [7.2, 7.9, 8.5, 9.2][Math.min(step, 3)] ?? 9.2, pct = Math.round(used * 10);
    const rows = [used.toFixed(1) + "M", (10 - used).toFixed(1) + "M", ((used / day) * 30).toFixed(1) + "M", 30 - day + " days"];
    return {
      ...o,
      slices: o.slices.map((s) => ({ ...s, v: pct })),
      center: o.center && { ...o.center, value: pct + "%" },
      rows: o.rows.map((r, i) => ({ ...r, text: rows[i] })),
    };
  },
  describe: {
    title: "Token budget",
    summary: "7.2M of a 10M token budget used (72%), 2.8M remaining; the forecast at reset is 10.4M, and the budget resets in 9 days.",
    table: { head: ["Item", "Value"], rows: data.rows.map((r) => [r.label, r.text]) },
  },
};
