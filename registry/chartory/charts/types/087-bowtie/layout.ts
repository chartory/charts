// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 087 Bowtie (Figma chart/087-bowtie-revenue): C.bowtie, acquisition stages to the won knot, then growth stages.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { bowtie } from "../../plots/bowtie";
import { data } from "./data";

const segs = [...data.left.map((s) => ({ ...s, side: "Acquire" })), { ...data.knot, side: "Win" }, ...data.right.map((s) => ({ ...s, side: "Grow" }))];

const BASE = [48000, 6200, 1900, 420, 61, 88, 124];
const count = (n: number) => (n >= 10000 ? Math.round(n / 1000) + "K" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n));
/** A later cohort: every stage moves by up to ±11 % (funnel order kept), its drawn size by the same ratio. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const f = (i: number) => 1 + 0.11 * Math.sin(i * 2.1 + step * 1.7 + 0.4);
  const seg = (s: (typeof data)["knot"], i: number) => {
    const n = Math.round(BASE[i] * f(i));
    return { ...s, v: Math.round(s.v * f(i)), text: i < 4 ? count(n) : "$" + n + "K" };
  };
  return { ...d, left: d.left.map((s, i) => seg(s, i)), knot: seg(d.knot, 3), right: d.right.map((s, i) => seg(s, i + 4)) };
}

/** Hover: one stage (its trapezoid and value): side, stage and value. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data;
  const all = [...d.left.map((s) => ({ ...s, side: "Acquire" })), { ...d.knot, side: "Win" }, ...d.right.map((s) => ({ ...s, side: "Grow" }))];
  const s = all[g];
  return s ? { kind: "value", text: `${s.side} · ${s.label.charAt(0) + s.label.slice(1).toLowerCase()} · ${s.text ?? d.fmt(s.v)}` } : null;
}

export const def: ChartDef = {
  no: 87,
  slug: "bowtie",
  legend: [["data/cat-2", "Acquire"], ["text/strong", "Win"], ["data/primary", "Grow"]],
  plot: (K, p, w, d) => bowtie(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Customer bowtie",
    summary: `September cohort: ${segs.map((s) => `${s.label.toLowerCase()} ${s.text}`).join(", ")}.`,
    table: { head: ["Stage", "Side", "Value"], rows: segs.map((s) => [s.label, s.side, s.text ?? data.fmt(s.v)]) },
  },
};
