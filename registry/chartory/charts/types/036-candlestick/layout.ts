// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 036 Candlestick (Figma chart/036): C.candles; no legend (direction reads from colour, the average is dashed).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { candles } from "../../plots/candles";
import { tickSeries } from "../../core/vary";
import { data } from "./data";

const f2 = (v: number) => v.toFixed(2);
const first = data.c[0], last = data.c[data.c.length - 1];
const hi = Math.max(...data.c.map((c) => c[1])), lo = Math.min(...data.c.map((c) => c[2]));

/** Tooltip for one candle (group = the candle with its volume bar): open, high, low, close and volume. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const c = o.c[g];
  if (!c) return null;
  const [op, h, l, cl, vol] = c, swatch = cl >= op ? "status/success" : "status/danger", ch = ((cl - op) / op) * 100;
  return {
    kind: "range", caps: `CANDLE ${g + 1} OF ${o.c.length} · ${ch >= 0 ? "+" : "−"}${Math.abs(ch).toFixed(2)}%`,
    rows: [["Open", "$" + f2(op)], ["High", "$" + f2(h)], ["Low", "$" + f2(l)], ["Close", "$" + f2(cl)], ["Volume", vol.toFixed(1)]].map(([label, value]) => ({ label, value, swatch })),
  };
}

export const def: ChartDef = {
  no: 36,
  slug: "candlestick",
  legend: null,
  // update: a revised feed for the same window; prices stretch / shrink around the window's low (±12 %, kept inside
  // the axis, every open still the previous close and every wick still spans its body) and volume moves ±15 %
  update: (d, step) => {
    const o = d as typeof data;
    const lo = Math.min(...o.c.map((c) => c[2])), hi = Math.max(...o.c.map((c) => c[1]));
    const k = Math.min(1 + 0.12 * Math.sin(step * 2.2 + 0.6), (o.max - 0.5 - lo) / (hi - lo)), sh = 0.6 * Math.sin(step * 1.4);
    const p = (v: number) => Math.max(o.min + 0.2, lo + sh + (v - lo) * k);
    return {
      ...o,
      c: o.c.map(([op, h, l, cl, vol], i) => [p(op), p(h), p(l), p(cl), Math.min(o.vmax, vol * (1 + 0.15 * Math.sin(step * 1.9 + i * 0.8)))] as typeof o.c[number]),
    };
  },
  // live: a new 4 h candle opens at the last close; the oldest leaves
  tick: (d, step) => {
    const o = d as typeof data;
    const last = o.c[o.c.length - 1][3];
    const close = tickSeries([last], step + 1, o.min + 1, o.max - 1)[0];
    const hi = Math.min(o.max, Math.max(last, close) + 0.6), lo = Math.max(o.min, Math.min(last, close) - 0.6);
    return { ...o, c: [...o.c.slice(1), [last, hi, lo, close, o.vmax * (0.35 + 0.5 * ((step * 37) % 10) / 10)] as [number, number, number, number, number]] };
  },
  plot: (K, p, w, d) => candles(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "SOL / USD · 4 h",
    summary: `${data.c.length} four-hour candles of SOL / USD from Sep 30 to Oct 9: open $${f2(first[0])}, last close $${f2(last[3])}, range $${f2(lo)} to $${f2(hi)}, with volume and a 7-period moving average.`,
    table: { head: ["Candle", "Open", "High", "Low", "Close", "Volume"], rows: data.c.map((c, i) => [i + 1, f2(c[0]), f2(c[1]), f2(c[2]), f2(c[3]), c[4].toFixed(1)]) },
  },
};
