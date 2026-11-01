// 007 Horizontal bars (Figma chart/007-horizontal-bars): C.hBars on the hub deliveries sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { hBars } from "../../plots/h-bars";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const num = (v: number) => v.toLocaleString("en-US");
const hub = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const del = data.rows.reduce((a, r) => a + r.value, 0), sch = data.rows.reduce((a, r) => a + r.total, 0);

/** Hover tooltip: one hub's delivered bar against its scheduled bar (share delivered as the pill). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const r = (d as typeof data).rows[g], pc = Math.round((r.value / r.total) * 100);
  return {
    kind: "compare",
    caps: r.label + " · DELIVERED",
    value: num(r.value),
    delta: { text: pc + "%", tone: pc >= 90 ? "success" : pc >= 75 ? "neutral" : "warning" },
    comparison: "OF " + num(r.total) + " SCHEDULED",
  };
};

export const def: ChartDef = {
  no: 7,
  slug: "horizontal-bars",
  legend: [["data/primary", "Delivered"], ["data/seq-2", "Scheduled"]],
  plot: (K, p, w, d) => hBars(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later in the day: each hub delivers 4 % more a step (±6 %), never past what it scheduled
    return {
      ...o,
      rows: o.rows.map((r, i) => {
        const value = clamp(Math.round(r.value * (1 + 0.04 * step + 0.06 * wave(i, step))), 1, r.total);
        return { ...r, value, text: num(value) };
      }),
    };
  },
  describe: {
    title: "Deliveries by hub",
    summary: `Parcels delivered today of those scheduled, across ${data.rows.length} hubs: ${num(del)} of ${num(sch)}; ${hub(data.rows[0].label)} delivered the most at ${num(data.rows[0].value)} of ${num(data.rows[0].total)}.`,
    table: { head: ["Hub", "Delivered", "Scheduled"], rows: data.rows.map((r) => [hub(r.label), num(r.value), num(r.total)]) },
  },
};
