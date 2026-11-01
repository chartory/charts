// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 050 Dot plot with intervals (Figma chart/050): C.ciDots on the carrier on-time sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { ciDots } from "../../plots/ci-dots";
import { data } from "./data";

const above = data.rows.filter((r) => r.lo >= data.target), below = data.rows.filter((r) => r.hi < data.target);

/** Tooltip for one carrier (group = its interval, caps and estimate): the 95% interval around its on-time rate. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  const t = r.lo >= o.target ? "status/success" : r.hi < o.target ? "status/danger" : "status/warning";
  const st = t === "status/success" ? "ABOVE SLA" : t === "status/danger" ? "BELOW SLA" : "UNCERTAIN";
  return { kind: "range", caps: `${r.label.toUpperCase()} · ${st}`, rows: [{ label: "High (95%)", value: r.hi + "%", swatch: t }, { label: "On-time", value: r.v + "%", swatch: t }, { label: "Low (95%)", value: r.lo + "%", swatch: t }] };
}

export const def: ChartDef = {
  no: 50,
  slug: "dot-plot-with-intervals",
  legend: [["status/success", "Above SLA"], ["status/warning", "Uncertain"], ["status/danger", "Below SLA"]],
  // update: the next 30 days; each carrier's on-time rate moves up to ±1 point and its interval half-width ±20 %
  // (one decimal, inside the axis); colours follow where the new interval sits against the SLA
  update: (d, step) => {
    const o = d as typeof data;
    const r1 = (v: number) => Math.round(v * 10) / 10;
    return {
      ...o,
      rows: o.rows.map((r, i) => {
        const half = ((r.hi - r.lo) / 2) * (1 + 0.2 * Math.sin(step * 2.3 + i * 1.1));
        const v = r1(Math.max(o.min + half + 0.2, Math.min(o.max - half - 0.2, r.v + Math.sin(step * 1.7 + i * 1.4))));
        return { ...r, v, lo: r1(v - half), hi: r1(v + half) };
      }),
    };
  },
  plot: (K, p, w, d) => ciDots(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "On-time rate by carrier",
    summary: `On-time delivery over 30 days with 95% confidence intervals against the ${data.target}% SLA: ${above.length} of ${data.rows.length} carriers are above it (${above.map((r) => r.label).join(", ")}), ${below.length} below (${below.map((r) => `${r.label} ${r.v}%`).join(", ")}), the rest uncertain.`,
    table: { head: ["Carrier", "On-time", "Low (95%)", "High (95%)"], rows: data.rows.map((r) => [r.label, r.v + "%", r.lo + "%", r.hi + "%"]) },
  },
};
