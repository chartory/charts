// 006 Histogram (Figma chart/006-histogram): C.hist on the latency sample, p50 and p95 marked.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { hist } from "../../plots/hist";
import { data } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);

const bin = (i: number) => `${i * 25}–${(i + 1) * 25} ms`;
const total = data.vals.reduce((a, b) => a + b, 0);

/** Hover tooltip: one 25 ms bin and its request count. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data;
  return { kind: "value", text: `${bin(g)} · ${o.vals[g].toLocaleString("en-US")} requests` };
};

export const def: ChartDef = {
  no: 6,
  slug: "histogram",
  legend: [["data/primary", "Within p95"], ["data/seq-2", "Tail above p95"]],
  plot: (K, p, w, d) => hist(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later days: the request count moves −7 … +13 % with ±3 % per bin; the shape (and so p50 / p95) holds
    const f = [1, 1.08, 0.93, 1.13][((step - 1) % 3) + 1];
    return { ...o, vals: o.vals.map((v, i) => Math.round(v * f * (1 + 0.03 * wave(i, step)))) };
  },
  describe: {
    title: "Response latency distribution",
    summary: `${total.toLocaleString("en-US")} requests in 25 ms latency bins from 0 to 900 ms; p50 is 250 ms, p95 is 475 ms.`,
    table: { head: ["Latency", "Requests"], rows: data.vals.map((v, i) => [bin(i), v.toLocaleString("en-US")]) },
  },
};
