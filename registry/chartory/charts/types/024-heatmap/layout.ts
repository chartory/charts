// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 024 Heatmap (Figma chart/024, "Card transactions by hour"): C.heat, weekdays × 2-hour slots, the Friday peak marked.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { heat } from "../../plots/heat";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

/** Hover tooltip: one cell (weekday × 2-hour slot): its share of the busiest slot, the cell's colour step, the count
 *  where the cell is marked, its rank otherwise. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, nc = o.cols.length, r = Math.floor(g / nc), c = g % nc, v = o.vals[r][c];
  const end = String((+o.cols[c] + 2) % 24 || 24).padStart(2, "0");
  const rank = 1 + o.vals.flat().filter((x) => x > v).length, mark = o.marks?.[r + "," + c];
  return {
    kind: "cell",
    caps: `${o.rows[r]} · ${o.cols[c]}:00–${end}:00`,
    value: String(Math.round(v * 100)),
    unit: "% of peak",
    swatch: v < 0.1 ? "data/idle" : "data/seq-" + Math.min(6, Math.ceil(v * 6)),
    share: mark ? mark + " TRANSACTIONS" : `RANK ${rank} OF ${o.vals.flat().length} SLOTS`,
  };
};

export const def: ChartDef = {
  no: 24,
  slug: "heatmap",
  legend: [["data/seq-1", "Low"], ["data/seq-6", "High"]],
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = heat(K, p, w, o);
    return o === data ? pl : keepNames(pl, heat(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later weeks: every slot moves ±12 %; values stay shares of the busiest slot (Friday 18:00 stays the peak), and the
    // marked counts follow the new peak count
    const [pr, pc] = [4, 9];
    const raw = o.vals.map((row, r) => row.map((v, c) => v * (1 + 0.12 * wave(r * 12 + c, step, 0.9))));
    const peak = raw[pr][pc];
    const vals = raw.map((row, r) => row.map((v, c) => (r === pr && c === pc ? 1 : clamp(v / peak, 0, 0.99))));
    const count = Math.round(412 * (1 + 0.06 * step + 0.05 * wave(0, step)));
    const marks = Object.fromEntries(Object.keys(o.marks ?? {}).map((k) => { const [r, c] = k.split(",").map(Number); return [k, String(Math.round(count * vals[r][c]))]; }));
    return { ...o, vals, marks };
  },
  describe: {
    title: "Card transactions by hour",
    summary: "Card transactions this week by weekday and 2-hour slot, as a share of the busiest slot: Friday 18:00 with 412 transactions, then Friday 16:00 with 398; the quietest slots are 00:00 to 04:00.",
    table: {
      head: ["Day", ...data.cols.map((c) => c + ":00")],
      rows: data.rows.map((r, i) => [r[0] + r.slice(1).toLowerCase(), ...data.vals[i].map((v) => Math.round(v * 100) + "%")]),
    },
  },
};
