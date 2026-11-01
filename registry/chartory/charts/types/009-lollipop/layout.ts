// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 009 Lollipop (Figma chart/009-lollipop): C.lollipop on the regional deposits sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { lollipop } from "../../plots/lollipop";
import { frame, type Frame, type Text } from "../../core/node";
import { data } from "./data";

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

const total = data.rows.reduce((a, r) => a + r[1], 0);

/** Hover tooltip: one region's lollipop. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const [label, , , text] = (d as typeof data).rows[g];
  return { kind: "value", text: `${label} · ${text}` };
};

export const def: ChartDef = {
  no: 9,
  slug: "lollipop",
  legend: [["data/cat-2", "East"], ["data/cat-4", "Midwest"], ["data/cat-3", "South"], ["data/cat-9", "West"]],
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = lollipop(K, p, w, o);
    return o === data ? pl : keepNames(pl, lollipop(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later months: deposits per region move ±12 %, inside the $650K scale
    return {
      ...o,
      rows: o.rows.map(([label, v, tok], i) => {
        const nv = clamp(Math.round(v * (1 + 0.12 * wave(i, step))), 60, 640);
        return [label, nv, tok, "$" + nv + "K"] as (typeof o.rows)[number];
      }),
    };
  },
  describe: {
    title: "Deposits by region",
    summary: `New deposits in October by region, $${total}K in total: ${data.rows.map((r) => `${r[0]} ${r[3]}`).join(", ")}.`,
    table: { head: ["Region", "Deposits"], rows: data.rows.map((r) => [r[0], r[3]]) },
  },
};
