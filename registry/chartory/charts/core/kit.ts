// The Ember chart kit's drawing helpers (Figma: dashboard/chartsidea/tools/ember-chart*.js, the `C` object), ported
// onto the node tree. Same names, same numbers, same rounding, so a type's plot ports line by line and lands on the
// Figma geometry. Surface "deep" (the composer shell the kit is drawn on).
import {
  al, collection, ellipse, fixTextWidth, frame, layout, rect as mkRect, remove, text, vector,
  type Ellipse, type Frame, type Gradient, type Paint, type Radius, type Rect, type Text, type Vector,
} from "./node";
import { signal } from "./signal-hook";
import { textWidth, type StyleName } from "./text";

/** Surface "deep" roles → Foundations tokens (C.surfaces.deep). */
const DEEP: Record<string, string> = {
  strong: "text/strong", body: "text/action", quiet: "text/unselected", label: "text/unselected", axis: "text/unselected",
  grid: "composer/edge", shell: "composer/shell", field: "composer/field", chipFill: "chip/fill", chipStroke: "chip/stroke",
  ring: "stroke/ring", edge: "composer/edge", cardStroke: "stroke/ring",
};
export const tok = (t: string): string => DEEP[t] ?? t;
export const paint = (t: string, opacity?: number): Paint => (opacity == null ? { tok: tok(t) } : { tok: tok(t), opacity });

export type Row = { label: string; text: string; pct?: string; tok?: string; tone?: string; h?: number };

/** Plot state per variant (C.PH, C.TOP, C.BASE, C.BG; C.SIZE for the AI Ops types, variants-aiops.js). */
export class Kit {
  PH = 176; TOP = 7; BASE = 154; BG = "field";
  SIZE: "XS" | "S" | "M" | "L" | null = null;
  /** the variant shows its legend (legend=on) */
  LEGEND_ON = false;
  /** the type's legend while its plot is drawn (C.LEGEND; Signal's multi line names its ends from it) */
  LEGEND: [string, string][] = [];

  // ---------- primitives ----------
  T(p: Frame, st: StyleName, ch: string, t?: string): Text { return text(p, st, ch, paint(t ?? "strong")); }
  caps(p: Frame, ch: string, t?: string): Text { return this.T(p, "Label/Caps", ch, t ?? "label"); }
  dot(p: Frame, s: number, t: string, name = "dot"): Ellipse { return ellipse(p, name, 0, 0, s, s, { fill: paint(t) }); }
  rect(p: Frame, name: string, x: number, y: number, w: number, h: number, t?: string | null, r?: Radius): Rect { return mkRect(p, name, x, y, w, h, t ? paint(t) : undefined, r); }
  plot(p: Frame, name: string, w: number, h: number): Frame { return frame(p, "plot · " + name, { w, h, sizeW: "fixed", sizeH: "fixed" }); }
  AL(p: Frame, name: string, dir: "HORIZONTAL" | "VERTICAL", o: Parameters<typeof al>[3] = {}): Frame { return al(p, name, dir === "HORIZONTAL" ? "H" : "V", { ...o, fill: o.fill ? paint(o.fill.tok) : undefined }); }
  fixW(f: Frame, w: number): Frame { f.w = w; f.sizeW = "fixed"; return f; }
  fixH(f: Frame, h: number): Frame { f.h = h; f.sizeH = "fixed"; return f; }
  fill(f: Frame): Frame { f.sizeW = "fill"; return f; }
  num(v: number | string): string { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /** Vector in plot coordinates (C.vec). */
  vec(pl: Frame, name: string, d: string, o: { stroke?: string; sw?: number; fill?: string | Gradient; opacity?: number } = {}): Vector {
    const v = vector(pl, name, d, {
      stroke: o.stroke ? paint(o.stroke) : undefined, sw: o.stroke ? o.sw ?? 2 : undefined,
      cap: o.stroke ? "round" : undefined, join: o.stroke ? "round" : undefined,
      fill: o.fill ? (typeof o.fill === "string" ? paint(o.fill) : o.fill) : undefined,
    });
    if (o.opacity != null) v.opacity = o.opacity;
    return v;
  }
  /** Path through points; smooth = Catmull-Rom as cubic Béziers (C.path). */
  path(pts: [number, number][], smooth?: boolean): string {
    if (!smooth) return pts.map((p, i) => (i ? "L " : "M ") + p[0] + " " + p[1]).join(" ");
    let d = "M " + pts[0][0] + " " + pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += " C " + c1.map((v) => +v.toFixed(2)).join(" ") + " " + c2.map((v) => +v.toFixed(2)).join(" ") + " " + p2[0] + " " + p2[1];
    }
    return d;
  }
  /** Ring on the plot ground (C.ring): ground fill, 1.5 px stroke inside. */
  ring(pl: Frame, name: string, cx: number, cy: number, d: number, t: string): Ellipse {
    return ellipse(pl, name, cx - d / 2, cy - d / 2, d, d, { fill: paint(this.BG), stroke: paint(t), sw: 1.5, align: "inside" });
  }
  guideRing(pl: Frame, cx: number, cy: number, r: number): Ellipse {
    return ellipse(pl, "guide ring", cx - r, cy - r, 2 * r, 2 * r, { stroke: paint("grid"), sw: 1, align: "center" });
  }

  // ---------- axes ----------
  /** Integer column solver: n columns in avail px, even gap, gap / column ratio near target (C.cols). */
  cols(avail: number, n: number, ratio: number) {
    let best: { c: number; g: number; d: number } | null = null;
    for (let c = 4; c <= avail; c++) {
      const g = (avail - n * c) / (n - 1);
      if (g < 2 || g % 2 || !Number.isInteger(g)) continue;
      const d = Math.abs(g / c - ratio);
      if (!best || d < best.d) best = { c, g, d };
    }
    return best;
  }
  /** n equal integer bands in avail px from x0; gap / column ≈ ratio; leftover split around (C.bands). */
  bands(x0: number, avail: number, n: number, ratio: number) {
    const cf = avail / (n + ratio * (n - 1));
    let g = Math.max(2, Math.round(ratio * cf));
    if (g % 2) g += 1;
    const c = Math.floor((avail - (n - 1) * g) / n);
    const off = Math.floor((avail - n * c - (n - 1) * g) / 2);
    return Array.from({ length: n }, (_, i) => ({ x: x0 + off + i * (c + g), w: c, g }));
  }
  /** Horizontal grid lines TOP → BASE with y labels centred on them (C.yGrid). */
  yGrid(pl: Frame, labels: string[], x0: number, w: number): void {
    const step = (this.BASE - this.TOP) / (labels.length - 1);
    for (let i = 0; i < labels.length; i++) {
      const y = this.TOP + Math.round(i * step);
      this.rect(pl, "grid-line " + String(i + 1).padStart(2, "0"), x0, y, w - x0, 1, "grid");
      const t = this.caps(pl, labels[i], "axis");
      t.name = "y · " + labels[i];
      t.x = Math.max(0, x0 - 8 - Math.ceil(t.w));
      t.y = y - 7;
    }
  }
  h(v: number, max: number): number { return Math.round((v / max) * (this.BASE - this.TOP)); }
  yMap(v: number, min: number, max: number): number { return Math.round(this.BASE - ((v - min) / (max - min)) * (this.BASE - this.TOP)); }
  xLabel(pl: Frame, s: string, cx: number, cw: number, y: number): Text {
    const t = this.caps(pl, s, "axis"); t.name = "x · " + s.toLowerCase();
    fixTextWidth(t, cw, "center"); t.x = cx; t.y = y; return t;
  }
  xAt(pl: Frame, s: string, x: number, y: number, align?: "start" | "end" | "center"): Text {
    const t = this.caps(pl, s, "axis"); t.name = "x · " + s.toLowerCase();
    const tw = Math.ceil(t.w);
    t.x = align === "start" ? x : align === "end" ? x - tw : Math.round(x - tw / 2); t.y = y; return t;
  }

  // ---------- parts ----------
  legend(p: Frame, items: [string, string][]): Frame {
    const lg = this.AL(p, "legend", "HORIZONTAL", { gap: 16, cross: "CENTER" });
    for (const [t, label] of items) {
      const it = this.AL(lg, "legend · " + label.toLowerCase(), "HORIZONTAL", { gap: 6, cross: "CENTER" });
      this.dot(it, 6, t, "swatch");
      this.caps(it, label.toUpperCase());
    }
    return lg;
  }
  /** Name / value list beside round plots (C.sideList), with the narrow-size rules. */
  sideList(pl: Frame, x: number, w: number, rows: Row[]): Frame {
    if (!collection.signal) return this.kitSideList(pl, x, w, rows);
    // Signal (collection-build.js): name over value (keeping the share) before anything is dropped; the kit's order
    // drops the share column first
    const list = this.kitSideList(pl, x, w, rows.map((r) => ({ ...r, pct: undefined })));
    if (!rows.some((r) => r.pct)) return list;
    const kids = (f: Frame) => f.children.filter((c) => !c.removed);
    rows.forEach((r, i) => { const row = kids(list)[i] as Frame | undefined; const v = row && (kids(row)[1] as Frame | undefined); if (r.pct && v) this.caps(v, r.pct); });
    const tooWide = () => { layout(list); return (kids(list) as Frame[]).some((r) => (r.layout!.mode === "V" ? Math.max(...kids(r).map((c) => c.w)) > w : kids(r)[0].w + (kids(r)[1] ? kids(r)[1].w + 12 : 0) > w)); };
    if (tooWide() && rows.length * 40 <= this.PH) for (const r of kids(list) as Frame[]) { r.layout = { ...r.layout!, mode: "V", main: "CENTER", cross: "MIN", gap: 2 }; this.fixH(r, 40); }
    if (tooWide()) for (const r of kids(list) as Frame[]) { const v = kids(r)[1] as Frame | undefined; if (v && kids(v).length > 1) remove(kids(v)[kids(v).length - 1]); }
    layout(list);
    list.y = Math.round((this.PH - list.h) / 2);
    return list;
  }
  private kitSideList(pl: Frame, x: number, w: number, rows: Row[]): Frame {
    const list = this.AL(pl, "list", "VERTICAL"); this.fixW(list, w);
    for (const r of rows) {
      const row = this.AL(list, "row · " + r.label.toLowerCase(), "HORIZONTAL", { main: "SPACE_BETWEEN", cross: "CENTER" });
      this.fill(row); this.fixH(row, r.h ?? 32);
      row.stroke = paint("edge"); row.sw = [0, 0, 1, 0]; row.align = "inside";
      const l = this.AL(row, "name", "HORIZONTAL", { gap: 8, cross: "CENTER" });
      if (r.tok) this.dot(l, 8, r.tok, "swatch");
      this.T(l, "Body/S", r.label, r.tok ? "strong" : "body");
      const rr = this.AL(row, "value", "HORIZONTAL", { gap: 10, cross: "CENTER" });
      this.T(rr, "Body/S", r.text, r.tone ?? "strong");
      if (r.pct) this.caps(rr, r.pct);
    }
    const rowsOf = () => list.children.filter((c) => !c.removed) as Frame[];
    const last = rowsOf()[rowsOf().length - 1]; last.sw = [0, 0, 0, 0];
    layout(list);
    const kids = (f: Frame) => f.children.filter((c) => !c.removed);
    const tooWide = () => {
      layout(list);
      return rowsOf().some((r) => (r.layout!.mode === "V" ? Math.max(...kids(r).map((c) => c.w)) > w : kids(r)[0].w + (kids(r)[1] ? kids(r)[1].w + 12 : 0) > w));
    };
    if (tooWide()) for (const r of rowsOf()) { const v = kids(r)[1] as Frame; if (kids(v).length > 1) remove(kids(v)[kids(v).length - 1]); }
    const stacked = () => rowsOf().some((r) => r.layout!.mode === "V");
    if (tooWide() && rows.length * 40 <= this.PH)
      for (const r of rowsOf()) { r.layout = { ...r.layout!, mode: "V", main: "CENTER", cross: "MIN", gap: 2 }; this.fixH(r, 40); }
    if (!stacked() && tooWide()) {
      const minRoom = Math.min(...rowsOf().map((r) => { const nm = kids(r)[0] as Frame, t = kids(nm)[kids(nm).length - 1]; return w - kids(r)[1].w - 12 - (nm.w - t.w); }));
      if (minRoom < 64 && rows.every((r) => r.tok)) for (const r of rowsOf()) remove(kids(r)[1]);
    }
    if (tooWide())
      for (const r of rowsOf()) {
        const nm = kids(r)[0] as Frame, t = kids(nm)[kids(nm).length - 1] as Text;
        const room = w - (r.layout!.mode !== "V" && kids(r)[1] ? kids(r)[1].w + 12 : 0) - (nm.w - t.w);
        if (t.w > room) { fixTextWidth(t, Math.max(24, Math.floor(room))); t.truncate = true; }
      }
    layout(list);
    list.x = x; list.y = Math.round((this.PH - list.h) / 2);
    return list;
  }
}

// ---------- helpers shared by the type files (ember-chart-3/4/5.js locals) ----------
export const P = (cx: number, cy: number, r: number, a: number): [number, number] => [+(cx + Math.cos(a) * r).toFixed(2), +(cy + Math.sin(a) * r).toFixed(2)];
export const X = (i: number, n: number, x0: number, x1: number): number => x0 + Math.round((i * (x1 - x0)) / (n - 1));
export function place<N extends { x: number; y: number }>(n: N, x: number, y: number): N { n.x = Math.round(x); n.y = Math.round(y); return n; }
export function dash(K: Kit, pl: Frame, name: string, d: string, t: string, sw = 1): Vector {
  const v = K.vec(pl, name, d, { stroke: t, sw }); v.dash = [3, 3]; v.cap = "butt"; return v;
}
/** Centred stack of texts (ctr): each text gets an even fixed width so it centres on whole pixels. */
export function ctr(K: Kit, pl: Frame, name: string, rows: [StyleName, string, string][], gap = 2): Frame {
  const c = K.AL(pl, name, "VERTICAL", { cross: "CENTER", gap });
  for (const [st, tx, tk] of rows) { const t = K.T(c, st, tx, tk); const tw = Math.ceil(t.w); fixTextWidth(t, tw % 2 ? tw + 1 : tw, "center"); }
  layout(c);
  return c;
}
/** A kit text's width as the builders measure it: a text made in the current collection (Signal: its style and
 *  sentence case, as Figma's adapter creates it) and measured. */
const measure = (t: string, st: StyleName): number => {
  if (!collection.signal) return textWidth(t, st);
  const S = signal();
  return S.isSignalStyle(st) ? textWidth(t, st) : textWidth(S.tx(t), S.mapStyle(st) as StyleName);
};
export const width = measure;

// ---------- more shared locals of ember-chart-2/3/4/5.js (same behaviour, ported once for every type) ----------
/** Smooth path without its leading move (ember-chart-2.js tail). */
export const tail = (K: Kit, pts: [number, number][]): string => K.path(pts, true).replace(/^M\s+[-\d.]+\s+[-\d.]+/, "");
/** Ellipse arc sector: angles in radians from 3 o'clock clockwise, inner = ratio of the radius (Figma arcData). */
export function arc(K: Kit, pl: Frame, name: string, cx: number, cy: number, R: number, inner: number, a0: number, a1: number, t: string, op?: number): Ellipse {
  const e = ellipse(pl, name, cx - R, cy - R, 2 * R, 2 * R, { fill: paint(t), arc: { start: a0, end: a1, inner } });
  if (op != null) e.opacity = op;
  void K;
  return e;
}
export const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number): [number, number][] => {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.08));
  return Array.from({ length: n + 1 }, (_, i) => P(cx, cy, r, a0 + ((a1 - a0) * i) / n));
};
/** Sequential ramp step for a 0–1 value (data/seq-1…6). */
export const seq = (v: number): string => "data/seq-" + Math.max(1, Math.min(6, 1 + Math.floor(v * 6)));
/** True when any label is wider than w in this style (measured untruncated). */
export const overflows = (labels: string[], w: number, st: StyleName): boolean => labels.some((l) => Math.ceil(measure(l, st)) > w);
/** One-line text in a fixed cell, truncated with an ellipsis, aligned (default centre). */
export function cell(K: Kit, pl: Frame, s: string, x: number, y: number, w: number, st: StyleName, t: string, align: Text["align"] = "center"): Text {
  const tx = K.T(pl, st, s, t);
  fixTextWidth(tx, w, align); tx.truncate = true; tx.x = Math.round(x); tx.y = Math.round(y);
  return tx;
}
/** Ringed point with a 2 px stroke, snapped to whole pixels. */
export function point(K: Kit, pl: Frame, name: string, x: number, y: number, d: number, t: string): Ellipse {
  const r = K.ring(pl, name, x, y, d, t); r.sw = 2; r.x = Math.round(r.x); r.y = Math.round(r.y); return r;
}
/** Status pill (C.pill): caps text in a tinted 18 px pill. */
export function pill(K: Kit, p: Frame, s: string, tone: "success" | "danger" | "warning" | "info" | "neutral"): Frame {
  const fg = { success: "status/success", danger: "status/danger", warning: "status/warning", info: "status/info", neutral: tok("body") }[tone];
  const bg = { success: "status/success-bg", danger: "status/danger-bg", warning: "status/warning-bg", info: "status/info-bg", neutral: tok("chipFill") }[tone];
  const pl = K.AL(p, "pill · " + s.toLowerCase(), "HORIZONTAL", { cross: "CENTER", pl: 6, pr: 6 });
  K.fixH(pl, 18); pl.fill = paint(bg); pl.radius = 999;
  K.T(pl, "Label/Caps", s, fg);
  layout(pl);
  return pl;
}
export function chip(K: Kit, pl: Frame, s: string, tone: Parameters<typeof pill>[3], x: number, y: number): Frame {
  const c = pill(K, pl, s, tone); c.x = Math.round(x); c.y = Math.round(y); return c;
}
/** Rect on whole pixels, at least 1 × 1, with an optional opacity (ember-chart-5.js box). */
export function box(K: Kit, pl: Frame, name: string, x: number, y: number, w: number, h: number, t: string, r?: Radius, op?: number): Rect {
  const b = K.rect(pl, name, Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)), t, r);
  if (op != null) b.opacity = op;
  return b;
}
export function outline<N extends Rect | Ellipse | Frame>(n: N, t: string, sw = 1): N { n.stroke = paint(t); n.sw = sw; n.align = "inside"; return n; }
export const tri = (K: Kit, pl: Frame, name: string, pts: [number, number][], t: string, op?: number): Vector => K.vec(pl, name, K.path(pts) + " Z", { fill: t, opacity: op });
export const star = (cx: number, cy: number, R: number, r: number): [number, number][] =>
  Array.from({ length: 10 }, (_, i) => P(cx, cy, i % 2 ? r : R, -Math.PI / 2 + (i * Math.PI) / 5));
/** Squarified treemap layout (C.squarify): values sorted descending → float rects in input order. */
export function squarify(vals: number[], X0: number, Y0: number, Wd: number, Ht: number): { x: number; y: number; w: number; h: number }[] {
  const tot = vals.reduce((a, b) => a + b, 0), sc = (Wd * Ht) / tot;
  const A = vals.map((v, i) => ({ a: v * sc, i }));
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const R = { x: X0, y: Y0, w: Wd, h: Ht };
  const worst = (row: typeof A, side: number) => {
    if (!row.length) return Infinity;
    const s = row.reduce((a, b) => a + b.a, 0), mx = Math.max(...row.map((r) => r.a)), mn = Math.min(...row.map((r) => r.a));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  const lay = (row: typeof A) => {
    const s = row.reduce((a, b) => a + b.a, 0);
    if (R.w >= R.h) { const cw = s / R.h; let yy = R.y; for (const r of row) { const hh = r.a / cw; out[r.i] = { x: R.x, y: yy, w: cw, h: hh }; yy += hh; } R.x += cw; R.w -= cw; }
    else { const rh = s / R.w; let xx = R.x; for (const r of row) { const ww = r.a / rh; out[r.i] = { x: xx, y: R.y, w: ww, h: rh }; xx += ww; } R.y += rh; R.h -= rh; }
  };
  let row: typeof A = [];
  let k = 0;
  while (k < A.length) {
    const side = Math.min(R.w, R.h);
    if (!row.length || worst(row.concat(A[k]), side) <= worst(row, side)) { row.push(A[k]); k++; } else { lay(row); row = []; }
  }
  if (row.length) lay(row);
  return out;
}
