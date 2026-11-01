// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 014 Streamgraph (Figma chart/014-streamgraph): C.stream2 on shipments by mode; the layers carry their own labels
// (no legend).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { stream2 } from "../../plots/stream2";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const oct = data.layers.reduce((a, l) => a + l.vals[9], 0);

/** Hover tooltip: one mode's layer over the year (now, peak month, year total and share). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, l = o.layers[g];
  const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);
  const all = o.layers.reduce((a, x) => a + sum(x.vals), 0), pk = Math.max(...l.vals);
  return {
    kind: "range",
    caps: `${l.name.toUpperCase()} · ${Math.round((sum(l.vals) / all) * 100)}% OF 2026`,
    rows: [
      { label: "Now · " + months[o.now], value: l.vals[o.now] + "K", swatch: l.tok },
      { label: "Peak · " + months[l.vals.indexOf(pk)], value: pk + "K", swatch: l.tok },
      { label: "Year", value: sum(l.vals) + "K", swatch: l.tok },
    ],
  };
};

export const def: ChartDef = {
  no: 14,
  slug: "streamgraph",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = stream2(K, p, w, o);
    return o === data ? pl : keepNames(pl, stream2(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later years: each mode moves ±12 % a month (whole K); the now chip carries the new month total
    const layers = o.layers.map((l, j) => ({ ...l, vals: l.vals.map((v, i) => Math.max(1, Math.round(v * (1 + 0.12 * wave(i + j * 4, step))))) }));
    // a layer is labelled where its thickest month away from "now" is ≥ 16 px; plots are 120 (XS, S) to 230 (L) px for
    // the largest month total, so a layer labelled at 120 keeps ≥ 16·max/120 and one unlabelled at 230 stays < 16·max/230
    const n = o.layers[0].vals.length;
    const ok = (i: number) => i >= 1 && i < n - 2 && Math.abs(i - o.now) > 1;
    const peak = (v: number[]) => Math.max(...v.filter((_, i) => ok(i)));
    const top = (ls: { vals: number[] }[]) => Math.max(...ls[0].vals.map((_, i) => ls.reduce((a, l) => a + l.vals[i], 0)));
    const M0 = top(o.layers);
    for (let pass = 0; pass < 6; pass++) {
      const M = top(layers);
      layers.forEach((l, j) => {
        const p0 = peak(o.layers[j].vals), pk = peak(l.vals);
        if (p0 * 120 >= 16 * M0 && pk * 120 < 16 * M) l.vals[l.vals.findIndex((v, i) => ok(i) && v === pk)] = Math.ceil((16 * M) / 120);
        if (p0 * 230 < 16 * M0 && pk * 230 >= 16 * M) l.vals = l.vals.map((v, i) => (ok(i) ? Math.min(v, Math.ceil((16 * M) / 230) - 1) : v));
      });
    }
    const now = layers.reduce((a, l) => a + l.vals[o.now], 0);
    return { ...o, layers, nowLabel: o.nowLabel.replace(/\d+K$/, now + "K") };
  },
  describe: {
    title: "Shipments by mode",
    summary: `Monthly shipments in K by mode, 2026, stacked around a centre line; October: ${oct}K in total (${data.layers.map((l) => `${l.name} ${l.vals[9]}K`).join(", ")}).`,
    table: { head: ["Month", ...data.layers.map((l) => l.name + " (K)")], rows: months.map((mo, i) => [mo, ...data.layers.map((l) => l.vals[i])]) },
  },
};
