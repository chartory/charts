// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 041 Orbit (Figma chart/041): C.orbits2; no legend (the side list names every tier). Radius-bound: XS legend=off
// keeps the legend-on plot height (flatXs; the Figma XS plot is 150 high, centred in 212).
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { orbits2 } from "../../plots/orbits2";
import { data } from "./data";

const num = (t: string) => parseFloat(t) * (t.endsWith("K") ? 1000 : 1);
const fmt = (v: number) => (v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(Math.round(v)));

/** Next week, moved by `a` (0–1) with the phase `ph`: wallet counts ±10 % per tier, each tier's active share ±3
 *  points inside the band that keeps its count of active dots; the overall share moves by the tiers' weighted change. */
function later(o: typeof data, step: number, a: number, ph: number): typeof data {
  const rings = o.rings.map((r, i) => {
    const act = Math.round((r.n * r.active) / 100);
    const lo = Math.ceil(((act - 0.5) * 100) / r.n), hi = Math.floor(((act + 0.5) * 100) / r.n - 1e-9);
    const active = Math.max(lo, Math.min(hi, Math.round(r.active + a * 3 * Math.sin(step * 1.9 + i * 1.4 + ph))));
    return { ...r, active, text: fmt(num(r.text) * (1 + a * 0.1 * Math.sin(step * 1.5 + i * 2.2 + ph))) };
  });
  const w = rings.map((r) => num(r.text)), tw = w.reduce((s, v) => s + v, 0);
  const shift = rings.reduce((s, r, i) => s + ((r.active - o.rings[i].active) * w[i]) / tw, 0);
  return { ...o, active: Math.round(o.active + shift), rings };
}

// The side list drops its percentages, stacks or truncates when a row gets too wide for its size; the update takes the
// first move (full first, then other phases, then smaller) that keeps every variant's marks.
const shape = (d: unknown) => (["xs", "s", "m", "l"] as Size[]).flatMap((s) => buildVariant(def, s, false, d).marks.map((m) => m.kind + "|" + (m.kind === "text" ? m.style : m.name)).join("\n")).join("\n\n");
let base: string | undefined;
function next(o: typeof data, step: number): typeof data {
  base ??= shape(data);
  for (const a of [1, 0.6]) for (const ph of [0, 0.8, 1.6, 2.4, 3.2]) { const c = later(o, step, a, ph); if (shape(c) === base) return c; }
  return later(o, step, 0, 0);
}

/** Tooltip for one tier (group = the tier's orbit of dots): its active share against all wallets. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rings[g];
  if (!r) return null;
  const d = r.active - o.active;
  return {
    kind: "compare", caps: `${r.label} · ${r.text} WALLETS`.toUpperCase(), value: r.active + "% active",
    delta: { text: (d > 0 ? "+" : d < 0 ? "−" : "±") + Math.abs(d) + " pts", tone: d > 0 ? "success" : d < 0 ? "danger" : "neutral" }, comparison: `VS ALL TIERS ${o.active}%`,
  };
}

export const def: ChartDef = {
  no: 41,
  slug: "orbit",
  legend: null,
  flatXs: true,
  // update: next week (see later), with the same marks at every size (see next)
  update: (d, step) => next(d as typeof data, step),
  plot: (K, p, w, d) => orbits2(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Active wallets by tier",
    summary: `${data.active}% of wallets were active this week: ${data.rings.map((r) => `${r.label} ${r.text} (${r.active}% active)`).join(", ")}.`,
    table: { head: ["Tier", "Wallets", "Active"], rows: data.rings.map((r) => [r.label, r.text, r.active + "%"]) },
  },
};
