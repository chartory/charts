// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// One chart variant, built the way the Figma kit builds it (dashboard/chartsidea/tools/variants-build.js +
// variants-xs.js): the card (padding, field ground, 0.5 px ring, radius/card), the plot at the size's height (taller
// without a legend; shorter when the legend wraps), the legend below, then the axis-label pass (keep inside, thin
// out collisions; XS thins rows of more than 6 evenly first) and the loose-label pass (pulled inside, never resized).
import { Kit, paint } from "./kit";
import { signal } from "./signal-hook";
import { append, collection, flatten, frame, labelLeft, layout, remove, type Frame, type Mark, type Text } from "./node";

export type Size = "xs" | "s" | "m" | "l";
/** Card width, padding and plot height per size (legend on). Plot widths 279 / 328 / 440 / 760. */
export const SIZES: Record<Size, { w: number; pad: number; ph: number }> = {
  xs: { w: 311, pad: 16, ph: 150 },
  s: { w: 360, pad: 16, ph: 150 },
  m: { w: 480, pad: 20, ph: 176 },
  l: { w: 800, pad: 20, ph: 260 },
};

/** A chart type: its legend (null when the type labels its marks) and its plot. */
/** What a tooltip shows for one hover group (the kit's five tooltip kinds, Kit · Hearth widgets 12:43151). Swatches
 *  and tones are Foundations tokens (data/cat-1, data/primary, …). */
export type TipRow = { label: string; value: string; swatch: string };
export type TooltipSpec =
  | { kind: "value"; text: string }
  | { kind: "series"; caps: string; rows: TipRow[]; total?: { label: string; value: string } }
  | { kind: "compare"; caps: string; value: string; delta: { text: string; tone: "success" | "warning" | "danger" | "info" | "neutral" }; comparison: string }
  | { kind: "range"; caps: string; rows: TipRow[] }
  | { kind: "cell"; caps: string; value: string; unit?: string; swatch: string; share: string };

export type ChartDef = {
  no: number;
  slug: string;
  legend: [string, string][] | null;
  /** XS legend=off keeps the legend-on plot height, centred in 212 (radius-bound round types). Shorthand for flat: ["xs"]. */
  flatXs?: boolean;
  /** Sizes whose legend=off variant keeps the legend-on plot height, centred in the card (tools/variants-rebuild.js
   *  applies it to every size it rebuilds: 085 and 100 are flat at XS and S). */
  flat?: Size[];
  /** AI Ops type (101+, tools/variants-aiops.js): the axis pass keeps XS rows whole (no even thinning first) and there is
   *  no on-data pass (the builder sets text/on-data itself where a label sits on a mark; 2026-10-18 decision). */
  ai?: boolean;
  /** The plot, from data (default: the type's sample data, from the Figma kit). */
  plot: (K: Kit, p: Frame, w: number, data?: unknown) => Frame;
  /** Hover tooltip for one hover group (the marks' `--g`), from the data the chart is drawn with; null: no tooltip. */
  tip?: (data: unknown, group: number) => TooltipSpec | null;
  /** Update motion (brief §4): the data of a later period, same shape and same marks (labels recomputed), so every
   *  mark morphs from old to new. step 1, 2, 3 … gives successive periods from the sample. */
  update?: (data: unknown, step: number) => unknown;
  /** Real-time type: one tick = the data one step on (a new point arrives at the end, the oldest leaves). */
  tick?: (data: unknown, step: number) => unknown;
  /** Text alternative: a title, a one-line summary and the data as a table (screen readers; v2 shows it). */
  describe: { title: string; summary: string; table: { head: string[]; rows: (string | number)[][] } };
};

export type Variant = { size: Size; legend: boolean; w: number; h: number; marks: Mark[] };

const xLabels = (pl: Frame) => pl.children.filter((t): t is Text => t.kind === "text" && t.name.startsWith("x · ") && t.sizing === "auto");

/** Axis labels named "x · …": keep inside the plot, thin out same-row collisions (first and last stay). */
export function fitAxis(pl: Frame, pw: number, xs: boolean): void {
  const ts = xLabels(pl);
  for (const t of ts) { const tw = Math.ceil(t.w); if (t.x < 0) t.x = 0; if (t.x + tw > pw) t.x = pw - tw; }
  const rows = new Map<number, Text[]>();
  for (const t of ts) rows.set(t.y, [...(rows.get(t.y) ?? []), t]);
  if (xs)
    for (const [k, r0] of rows) {
      r0.sort((a, b) => a.x - b.x);
      if (r0.length > 6) {
        r0.forEach((t, i) => { if (i % 2 === 1 && i !== r0.length - 1) remove(t); });
        if (r0.length % 2 === 0) remove(r0[r0.length - 2]);
        rows.set(k, r0.filter((t) => !t.removed));
      }
    }
  for (const r0 of rows.values()) {
    const r = [...r0].sort((a, b) => a.x - b.x);
    if (r.length < 3) continue;
    const kept = [r[0]];
    for (let i = 1; i < r.length; i++) {
      const t = r[i], prev = kept[kept.length - 1];
      const hit = t.x < prev.x + Math.ceil(prev.w) + 8;
      if (!hit) { kept.push(t); continue; }
      if (i === r.length - 1 && kept.length > 1) { remove(prev); kept.pop(); kept.push(t); } else remove(t);
    }
  }
}

// Labels on data marks (Figma tools/ember-ondata.js, run after every build): a text, or a small shape drawn in a
// text/* colour, whose centre sits on a saturated mark (topmost filled mark under it in paint order, effective
// opacity ≥ 0.6) reads text/on-data; a quiet text on the light end of the sequential ramp reads text/on-tint.
// Hollow arcs never count as under a label; a shape only counts as on a mark that is at least twice its area.
const SATURATED = /^data\/(primary|cat-\d+|seq-[456])$|^status\/(success|warning|danger|info)$|^accent\/default$|^toggle\/(on|on-deep)$|^button\/primary-top$/;
const TINT = /^data\/seq-[123]$/;
export function onData(marks: Mark[]): void {
  const hollow = (m: Mark) => m.kind === "ellipse" && !!m.arc && (m.arc.inner > 0 || Math.abs(m.arc.end - m.arc.start) < 6.28);
  const solid = (m: Mark) => ("fill" in m && m.fill && "tok" in m.fill ? m.fill : null);
  marks.forEach((t, i) => {
    const isText = t.kind === "text", isShape = t.kind === "vector" || t.kind === "rect" || t.kind === "ellipse";
    if (!isText && !isShape) return;
    const useStroke = !isText && "stroke" in t && !!t.stroke;
    const p = useStroke ? (t as { stroke?: { tok: string } }).stroke : solid(t);
    if (!p || !/^text\//.test(p.tok) || p.tok === "text/inverse" || p.tok === "text/on-data") return;
    const cx = t.ax + t.w / 2, cy = t.ay + t.h / 2;
    let top: { m: Mark; tok: string; op: number } | null = null;
    for (let j = 0; j < i; j++) {
      const m = marks[j];
      if (m.kind === "text" || hollow(m)) continue;
      if (m.kind === "frame" && !m.fill) continue;
      const f = "fill" in m ? m.fill : undefined;
      if (!f) continue;
      if (cx > m.ax && cx < m.ax + m.w && cy > m.ay && cy < m.ay + m.h)
        top = "tok" in f ? { m, tok: f.tok, op: (f.opacity ?? 1) * (m.opacity ?? 1) } : { m, tok: "", op: 0 };
    }
    if (!top || top.op < 0.6) return;
    if (!isText && top.m.w * top.m.h < 2 * t.w * t.h) return;
    if (isText && TINT.test(top.tok) && p.tok !== "text/strong" && p.tok !== "text/on-tint") { p.tok = "text/on-tint"; return; }
    if (SATURATED.test(top.tok)) p.tok = "text/on-data";
  });
}

/** Loose labels a few px past the plot edge are pulled inside (never resized); the builder does this after every plot,
 *  for the chart variants and the Hearth chart cards (hearth-build.js). */
export function pullInside(pl: Frame, pw: number, ph: number): void {
  for (const t of pl.children) {
    if (t.removed) continue;
    const loose = (t.kind === "text" && t.sizing === "auto") || (t.kind === "frame" && t.layout && t.sizeW === "hug" && t.sizeH === "hug");
    if (!loose) continue;
    const tw = Math.ceil(t.w), th = Math.ceil(t.h);
    if (t.x < 0) t.x = 0; if (t.x + tw > pw) t.x = pw - tw; if (t.y + th > ph) t.y = ph - th; if (t.y < 0) t.y = 0;
  }
}

/** The visual language a chart is drawn in (HANDOFF-2026-10-18 § 2): Hearth (the kit) or Signal. */
export type Collection = "hearth" | "signal";

export function buildVariant(def: ChartDef, size: Size, legendOn: boolean, data?: unknown, col: Collection = "hearth"): Variant {
  return buildTree(def, size, legendOn, data, col).variant;
}

/** buildVariant with the laid-out node tree kept (the type page's anatomy reads the layers as Figma names them).
 *  Signal (collection-build.js card()): its card and legend, the kit's drawing with the collection's tokens and type
 *  (or the collection's own renderer for twelve plot kinds), then the whole-pixel post-pass; no on-data pass. */
export function buildTree(def: ChartDef, size: Size, legendOn: boolean, data?: unknown, col: Collection = "hearth"): { card: Frame; variant: Variant } {
  const S = col === "signal";
  const G = S ? signal() : null; // the Signal parts (core/signal-hook.ts): asked before anything is built
  collection.signal = S;
  try {
    const { w: cw, pad, ph } = SIZES[size];
    const K = new Kit();
    const card = frame(null, `size=${size.toUpperCase()}, legend=${legendOn ? "on" : "off"}`, {
      layout: { mode: "V", gap: 16, pad: [pad, pad, pad, pad], main: "MIN", cross: "MIN" },
      w: cw, sizeW: "fixed", sizeH: "hug", fill: paint("field"), radius: 16, stroke: paint("ring"), sw: 0.5, align: "inside", strokesInLayout: false,
    });
    if (G) G.styleCard(card);
    const pw = cw - 2 * pad;
    const flat = !S && (def.flat ?? (def.flatXs ? ["xs"] : [])).includes(size) && !legendOn;
    K.PH = ph + (!legendOn && !flat ? 30 : 0); K.TOP = 7; K.BASE = K.PH - 22; K.BG = "field";
    K.SIZE = size.toUpperCase() as Kit["SIZE"];
    K.LEGEND = def.legend ?? [];
    K.LEGEND_ON = legendOn;
    let L: Frame | null = null;
    if (legendOn && def.legend) {
      L = G ? G.legend(card, def.legend) : K.legend(card, def.legend);
      L.layout = { ...L.layout!, wrap: true, wrapGap: 8 }; L.sizeW = "fixed"; L.w = pw;
      layout(L);
      const extra = Math.max(0, Math.ceil(L.h) - 14);
      K.PH -= extra; K.BASE = K.PH - 22;
    }
    const pl = def.plot(K, card, pw, data);
    if (L) append(card, L);
    fitAxis(pl, pw, size === "xs" && !def.ai && !S);
    pullInside(pl, pw, K.PH);
    if (!S) labelLeft(card); // the Signal sets keep centred fixed texts in hugging stacks centred (collection-build.js)
    if (flat) { card.sizeH = "fixed"; card.h = SIZES[size].pad * 2 + ph + 30; card.layout = { ...card.layout!, main: "CENTER" }; }
    layout(card);
    if (S) {
      G!.post(pl, pw, K.PH);
      G!.mapPaints(card);
      G!.settle(card);
      layout(card);
      if (Math.abs(card.h - G!.SIGNAL_H[size]) > 0.5) { card.sizeH = "fixed"; card.h = G!.SIGNAL_H[size]; }
    }
    const marks = flatten(card);
    if (!def.ai && !S) onData(marks);
    return { card, variant: { size, legend: legendOn, w: card.w, h: card.h, marks } };
  } finally {
    collection.signal = false;
  }
}

/** A chart card outside the four kit sizes, as the Website pages draw one from their own data (chartsidea
 *  tools/site-compare-v2.js, site-question-v2.js, site-metric-v2.js): card `w` with `pad` all round, the plot at a
 *  fixed `ph` (the legend, if any, goes under it and never shortens it), the on-data pass, and, with `round`, every
 *  loose node of the plot on a whole pixel (the builder rounds them after the plot). No axis or loose-label pass:
 *  the site builders do not run them. `h` fixes the card height (cards in one row share the tallest). */
/** wrap: the legend wraps (8 apart) inside the card when it is wider than the plot (the contrast checker's preview) */
export type Box = { w: number; pad: number; ph: number; h?: number; round?: boolean; legend?: [string, string][]; wrap?: boolean };

/** col "signal": the same box drawn in Signal (the card, legend and post-pass as buildTree does), so a page's own
 *  cards follow the collection the visitor picked (the question, compare and metric pages, 2026-10-21). */
export function buildBox(def: ChartDef, box: Box, data?: unknown, col: Collection = "hearth"): Variant {
  const S = col === "signal";
  const G = S ? signal() : null; // the Signal parts (core/signal-hook.ts): asked before anything is built
  collection.signal = S;
  try {
    const K = new Kit();
    const card = frame(null, "card", {
      layout: { mode: "V", gap: 16, pad: [box.pad, box.pad, box.pad, box.pad], main: "MIN", cross: "MIN" },
      w: box.w, sizeW: "fixed", sizeH: box.h ? "fixed" : "hug", h: box.h ?? 0, fill: paint("field"), radius: 16, stroke: paint("ring"), sw: 0.5, align: "inside", strokesInLayout: false,
    });
    if (G) G.styleCard(card);
    K.PH = box.ph; K.TOP = 7; K.BASE = K.PH - 22; K.BG = "field";
    K.SIZE = "M";
    K.LEGEND = box.legend ?? [];
    K.LEGEND_ON = !!box.legend;
    const pw = box.w - 2 * box.pad;
    const pl = def.plot(K, card, pw, data);
    if (box.legend) {
      const L = G ? G.legend(card, box.legend) : K.legend(card, box.legend);
      if (box.wrap || S) { L.layout = { ...L.layout!, wrap: true, wrapGap: 8 }; L.sizeW = "fixed"; L.w = pw; }
      if (S) append(card, L);
    }
    if (box.round) {
      const roundIn = (f: Frame) => {
        for (const n of f.children) {
          if (!f.layout && n.kind !== "vector") { n.x = Math.round(n.x); n.y = Math.round(n.y); }
          if (n.kind === "frame") roundIn(n);
        }
      };
      roundIn(pl);
    }
    layout(card);
    if (S) {
      G!.post(pl, pw, K.PH);
      G!.mapPaints(card);
      G!.settle(card);
      layout(card);
    }
    const marks = flatten(card);
    if (!def.ai && !S) onData(marks);
    return { size: "m", legend: !!box.legend, w: card.w, h: card.h, marks };
  } finally {
    collection.signal = false;
  }
}

/** Every variant of a type, in Figma's set order. */
export function variants(def: ChartDef, col: Collection = "hearth"): Variant[] {
  const out: Variant[] = [];
  for (const s of ["xs", "s", "m", "l"] as Size[]) for (const lg of def.legend ? [true, false] : [false]) out.push(buildVariant(def, s, lg, undefined, col));
  return out;
}
