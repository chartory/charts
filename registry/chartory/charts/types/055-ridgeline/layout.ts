// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 055 Ridgeline (Figma chart/055, "Response length by model"): C.ridgeline, one density per model, 0–2K tokens.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { ridgeline } from "../../plots/ridgeline";
import { data } from "./data";

// tooltip: one model's density (group = row): main peak, its spread and the second peak when there is one
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g];
  if (!r || !r.peaks.length) return null;
  const tk = (v: number) => v.toLocaleString("en-US") + " tokens";
  const [m, s] = r.peaks[0];
  return {
    kind: "range",
    caps: r.label.toUpperCase() + " · RESPONSE LENGTH",
    rows: [
      { label: "Peak", value: tk(m), swatch: r.tok },
      { label: "Spread", value: "±" + tk(s), swatch: r.tok },
      ...r.peaks.slice(1, 2).map(([m2]) => ({ label: "Second peak", value: tk(m2), swatch: r.tok })),
    ],
  };
};

export const def: ChartDef = {
  no: 55,
  slug: "ridgeline",
  legend: null,
  plot: (K, p, w, d) => ridgeline(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next release: each peak moves up to ±6 % in length and ±10 % in spread
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      rows: o.rows.map((r, k) => ({ ...r, peaks: r.peaks.map(([m, s, wt], j) => [Math.round(m * (1 + 0.06 * Math.sin(k * 1.4 + j * 2.2 + step * 2.1))), Math.round(s * (1 + 0.1 * Math.sin(k * 0.8 + j * 1.3 + step * 1.7))), wt] as [number, number, number]) })),
    };
  },
  describe: {
    title: "Response length by model",
    summary: `Distribution of response length in tokens for ${data.rows.length} models: ${data.rows.map((r) => `${r.label} peaks near ${r.peaks[0][0]}`).join(", ")}; ATLAS 3, ORION and VEGA have a second, smaller peak.`,
    table: {
      head: ["Model", "Peak (tokens)", "Spread (tokens)", "Weight"],
      rows: data.rows.flatMap((r) => r.peaks.map(([m, s, wt]) => [r.label, m, s, wt])),
    },
  },
};
