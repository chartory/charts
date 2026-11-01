// 013 Overlapping areas (Figma chart/013-overlapping-areas): C.multiLine with translucent areas on volume per venue.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { multiLine } from "../../plots/multi-line";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

const names = ["Northgate", "Tidepool", "Ardent DEX"];
const day = (i: number) => (i < 21 ? `Sep ${10 + i}` : `Oct ${i - 20}`);
const m = (v: number) => Math.round(v);

/** Hover tooltip: one venue's area over the 30 days (latest day, peak, low). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const s = (d as typeof data).series[g], last = s.vals.length - 1;
  return {
    kind: "range",
    caps: names[g].toUpperCase() + " · DAILY VOLUME",
    rows: [
      { label: day(last), value: "$" + m(s.vals[last]) + "M", swatch: s.tok },
      { label: "Peak", value: "$" + m(Math.max(...s.vals)) + "M", swatch: s.tok },
      { label: "Low", value: "$" + m(Math.min(...s.vals)) + "M", swatch: s.tok },
    ],
  };
};

export const def: ChartDef = {
  no: 13,
  slug: "overlapping-areas",
  legend: [["data/cat-2", "Northgate"], ["data/cat-3", "Tidepool"], ["data/cat-1", "Ardent DEX"]],
  plot: (K, p, w, d) => multiLine(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later windows: each venue drifts ±10 % on a slow swell plus ±4 % per day, inside the $600M axis
    return { ...o, series: o.series.map((s, j) => ({ ...s, vals: s.vals.map((v, i) => clamp(r2(v * (1 + 0.1 * Math.sin(i * 0.35 + step * 1.9 + j * 1.9) + 0.04 * wave(i + j * 7, step))), 10, 590)) })) };
  },
  describe: {
    title: "Volume by venue",
    summary: `Daily spot volume per venue in $M, Sep 10 to Oct 9; on Oct 9: ${names.map((n, j) => `${n} $${m(data.series[j].vals[29])}M`).join(", ")}.`,
    table: { head: ["Day", ...names.map((n) => n + " ($M)")], rows: data.series[0].vals.map((_, i) => [day(i), ...data.series.map((s) => m(s.vals[i]))]) },
  },
};
