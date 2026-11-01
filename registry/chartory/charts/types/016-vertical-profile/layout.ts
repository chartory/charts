// 016 Vertical profile (Figma chart/016-vertical-profile): C.profile on recall by context length for two models.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { profile } from "../../plots/profile";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Hover tooltip: one model's profile, its recall at every context length. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, s = o.series[g];
  return {
    kind: "range",
    caps: s.name.toUpperCase() + " · RECALL",
    rows: o.rows.map((r, i) => ({ label: r, value: s.vals[i] + "%", swatch: s.tok })),
  };
};

export const def: ChartDef = {
  no: 16,
  slug: "vertical-profile",
  legend: [["data/primary", "Atlas 3"], ["data/cat-2", "Kite 2 Pro"]],
  plot: (K, p, w, d) => profile(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later checkpoints: recall moves up to ±3 points per context length plus a point per step, inside 60–100 %
    return { ...o, series: o.series.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => clamp(v + Math.round(3 * wave(i + j * 5, step)) + step, 61, 99)) })) };
  },
  describe: {
    title: "Accuracy by context length",
    summary: `Needle recall by context length: Atlas 3 falls from ${data.series[0].vals[0]}% at 4K to ${data.series[0].vals[4]}% at 128K; Kite 2 Pro from ${data.series[1].vals[0]}% to ${data.series[1].vals[4]}%.`,
    table: { head: ["Context", "Atlas 3", "Kite 2 Pro"], rows: data.rows.map((r, i) => [r, data.series[0].vals[i] + "%", data.series[1].vals[i] + "%"]) },
  },
};
