// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 019 Polar area (Figma chart/019, "Signups by channel"): C.polar with the channel list beside it.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { polar } from "../../plots/polar";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
/** Whole-percent shares that sum to 100 (largest remainder). */
const shares = (vs: number[]): number[] => {
  const t = vs.reduce((a, b) => a + b, 0), raw = vs.map((v) => (v / t) * 100), out = raw.map(Math.floor);
  const left = 100 - out.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => out[i]++);
  return out;
};
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

/** Hover tooltip: one channel's sector (signups and share, as in the list). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const it = (d as typeof data).items[g];
  return { kind: "value", text: `${it.label} · ${it.text} · ${it.pct}` };
};

export const def: ChartDef = {
  no: 19,
  slug: "polar-area",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = polar(K, p, w, o);
    return o === data ? pl : keepNames(pl, polar(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later months: signups per channel move ±8 % (to the hundred); values and shares recomputed, shares sum to 100
    const vs = o.items.map((it, i) => Math.max(100, Math.round((it.v * (1 + 0.08 * wave(i, step))) / 100) * 100));
    const pc = shares(vs);
    return { ...o, items: o.items.map((it, i) => ({ ...it, v: vs[i], text: (vs[i] / 1000).toFixed(1) + "K", pct: pc[i] + "%" })) };
  },
  describe: {
    title: "Signups by channel",
    summary: `13.8K new trial signups in September across six channels: Organic leads with ${data.items[0].text} (${data.items[0].pct}), Events is smallest with ${data.items[5].text} (${data.items[5].pct}).`,
    table: { head: ["Channel", "Signups", "Share"], rows: data.items.map((it) => [it.label, it.v, it.pct ?? ""]) },
  },
};
