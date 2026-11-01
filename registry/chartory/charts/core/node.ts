// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// A small Figma-like node tree for chart layout: frames (absolute or auto layout), rectangles, ellipses, vectors and
// texts, with the auto-layout rules the kit uses (direction, gap, padding, wrap, main / cross alignment, hug / fixed /
// fill sizing). The Figma builders (dashboard/chartsidea/tools/ember-chart*.js) port onto it line by line; the tree
// then flattens into a scene of absolute marks that the SVG renderer and the Figma diff both read.
import { signal } from "./signal-hook";
import { baselineAt, textWidth, wrapLines, type StyleName, style as styleOf } from "./text";

/** A colour from the tokens (Foundations variable name, e.g. "data/primary"), with an optional paint opacity. */
export type Paint = { tok: string; opacity?: number };
export type Gradient = { kind: "linear"; from: [number, number]; to: [number, number]; stops: { pos: number; tok: string }[] };
export type Radius = number | [number, number, number, number];
export type StrokeAlign = "inside" | "center" | "outside";

/** Motion of a data mark (brief §4: data moves, chrome does not). sweep: an arc fills along its own direction
 *  (rings, gauges, pie slices: clockwise from their start). grow: from an edge (origin: bottom / top for
 *  columns, left / right for horizontal bars); draw: a stroke from
 *  its start; reveal: wiped in left to right; pop: from its centre; fade: opacity. order staggers within the chart;
 *  group ties marks of one datum together for hover (a bar, its value and its label). */
export type Motion = { kind: "grow" | "draw" | "reveal" | "pop" | "fade" | "sweep"; order: number; origin?: "bottom" | "top" | "left" | "right"; group?: number; after?: boolean };
/** Figma effects, colour from a Foundations effect token: drop shadow, or inner shadow (the 1 px top highlight). */
export type Effect = {
  type: "drop" | "inner"; x: number; y: number; blur: number; spread: number; tok: string;
  /** the shell shadow: y and blur are bound to effect/shell-y / effect/shell-blur (per theme; y / blur here = Ember) */
  shell?: boolean;
};
/** abs: positioned absolutely inside an auto-layout parent (Figma layoutPositioning ABSOLUTE). */
/** cls: a class on the drawn element (CSS-only motion such as the loading skeleton's pulse) */
type Base = { name: string; x: number; y: number; w: number; h: number; opacity?: number; parent?: Frame; removed?: boolean; motion?: Motion; abs?: boolean; cls?: string };
export type Rect = Base & { kind: "rect"; sizeW?: "fixed" | "fill"; fill?: Paint | Gradient; stroke?: Paint; sw?: number; align?: StrokeAlign; radius?: Radius; dash?: [number, number] };
export type Ellipse = Base & { kind: "ellipse"; fill?: Paint; stroke?: Paint; sw?: number; align?: StrokeAlign; arc?: { start: number; end: number; inner: number }; dash?: [number, number] };
/** Figma regular polygon: pointCount vertices, first at the top, fitted to its box. */
export type Polygon = Base & { kind: "polygon"; points: number; fill?: Paint; stroke?: Paint; sw?: number; align?: StrokeAlign };
/** Path data in the parent's coordinates (x / y stay 0); w / h are the path's box for the diff. */
export type Vector = Base & { kind: "vector"; d: string; fill?: Paint | Gradient; stroke?: Paint; sw?: number; cap?: "round" | "butt"; join?: "round" | "miter"; dash?: [number, number] };
export type Text = Base & {
  kind: "text"; text: string; style: StyleName; fill: Paint;
  /** auto: width from the text; fixed: a set width (align applies); truncate: fixed width, ends with an ellipsis */
  sizing: "auto" | "fixed"; align: "left" | "center" | "right"; truncate?: boolean; rotation?: number;
  /** fixed width, auto height: the text wraps (wrapText) */
  wrap?: boolean;
  /** fixed width that fills a vertical auto-layout parent (layoutSizingHorizontal FILL) */
  fillW?: boolean;
  /** "fill": takes the room left in a horizontal auto-layout parent (layoutGrow 1; the text becomes fixed width) */
  sizeW?: "fill";
};
export type Layout = {
  mode: "H" | "V"; gap: number; pad: [number, number, number, number];
  main: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN"; cross: "MIN" | "CENTER" | "MAX" | "BASELINE";
  wrap?: boolean; wrapGap?: number;
};
export type Frame = Base & {
  kind: "frame"; children: Node[]; layout?: Layout;
  sizeW: "hug" | "fixed" | "fill"; sizeH: "hug" | "fixed" | "fill";
  fill?: Paint | Gradient; stroke?: Paint; sw?: number | [number, number, number, number]; align?: StrokeAlign; radius?: Radius;
  /** clipsContent: children are clipped to the frame's (rounded) box */
  clips?: boolean;
  /** Figma counts an inside stroke in auto layout (content sits inside it) unless this is false (the chart card). */
  strokesInLayout?: boolean;
  effects?: Effect[];
};
export type Node = Rect | Ellipse | Polygon | Vector | Text | Frame;

const attach = <T extends Node>(parent: Frame | null, n: T): T => {
  if (parent) { parent.children.push(n); n.parent = parent; }
  return n;
};

export function frame(parent: Frame | null, name: string, o: Partial<Frame> = {}): Frame {
  return attach(parent, { kind: "frame", name, x: 0, y: 0, w: 0, h: 0, children: [], sizeW: "hug", sizeH: "hug", ...o } as Frame);
}
/** Auto-layout frame (C.AL): hug in both directions until fixed. */
export function al(parent: Frame | null, name: string, mode: "H" | "V", o: { gap?: number; pt?: number; pr?: number; pb?: number; pl?: number; main?: Layout["main"]; cross?: Layout["cross"]; fill?: Paint } = {}): Frame {
  return frame(parent, name, {
    layout: { mode, gap: o.gap ?? 0, pad: [o.pt ?? 0, o.pr ?? 0, o.pb ?? 0, o.pl ?? 0], main: o.main ?? "MIN", cross: o.cross ?? "MIN" },
    fill: o.fill,
  });
}
export function rect(parent: Frame, name: string, x: number, y: number, w: number, h: number, fill?: Paint | Gradient, radius?: Radius): Rect {
  return attach(parent, { kind: "rect", name, x, y, w, h, fill, radius } as Rect);
}
export function ellipse(parent: Frame, name: string, x: number, y: number, w: number, h: number, o: Partial<Ellipse> = {}): Ellipse {
  return attach(parent, { kind: "ellipse", name, x, y, w, h, ...o } as Ellipse);
}
export function polygon(parent: Frame, name: string, x: number, y: number, w: number, h: number, points: number, o: Partial<Polygon> = {}): Polygon {
  return attach(parent, { kind: "polygon", name, x, y, w, h, points, ...o } as Polygon);
}
/** Vertices of a Figma regular polygon in its box: first vertex at the top, the shape scaled to touch every edge. */
export function polygonPoints(x: number, y: number, w: number, h: number, n: number): [number, number][] {
  const raw = Array.from({ length: n }, (_, i) => [Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n), Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n)] as [number, number]);
  const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  return raw.map(([px, py]) => [x + ((px - x0) / (x1 - x0)) * w, y + ((py - y0) / (y1 - y0)) * h]);
}
export function vector(parent: Frame, name: string, d: string, o: Partial<Vector> = {}): Vector {
  const b = pathBox(d);
  return attach(parent, { kind: "vector", name, d, x: b.x, y: b.y, w: b.w, h: b.h, ...o } as Vector);
}
/** The collection the tree is built in (buildTree sets it for one synchronous build). In Signal a kit text takes the
 *  collection's style and sentence case at creation, so it measures as Figma's adapter laid it out (Kx.T). */
export const collection = { signal: false };
export function text(parent: Frame, styleName: StyleName, chars: string, fill: Paint, name?: string): Text {
  if (collection.signal) { const S = signal(); if (!S.isSignalStyle(styleName)) { styleName = S.mapStyle(styleName) as StyleName; chars = S.tx(chars); } }
  return attach(parent, {
    kind: "text", name: name ?? chars.slice(0, 40), x: 0, y: 0, w: textWidth(chars, styleName), h: styleOf(styleName).lineHeight,
    text: chars, style: styleName, fill, sizing: "auto", align: "left",
  } as Text);
}
/** Make a text fixed-width (textAutoResize HEIGHT + resize). */
export function fixTextWidth(t: Text, w: number, align: Text["align"] = t.align): Text {
  t.sizing = "fixed"; t.w = w; t.align = align; return t;
}
/** Fixed width, auto height: the text wraps at spaces and grows by lines (Figma textAutoResize HEIGHT). */
export function wrapText(t: Text, w: number, align: Text["align"] = t.align): Text {
  fixTextWidth(t, w, align); t.wrap = true;
  t.h = wrapLines(t.text, t.style, w).length * styleOf(t.style).lineHeight;
  return t;
}
export function remove(n: Node): void {
  n.removed = true;
  if (n.parent) n.parent.children = n.parent.children.filter((c) => c !== n);
}
export function append(parent: Frame, n: Node): void {
  if (n.parent) n.parent.children = n.parent.children.filter((c) => c !== n);
  parent.children.push(n); n.parent = parent;
}

/** Bounding box of path data (M / L / C / Z with absolute numbers, as the builders write them). */
export function pathBox(d: string): { x: number; y: number; w: number; h: number } {
  const nums = d.match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number) ?? [];
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
  if (!xs.length) return { x: 0, y: 0, w: 0, h: 0 };
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

const live = (f: Frame) => f.children.filter((c) => !c.removed);

/** The kit's label rule (chartsidea/tools/label-left.js, run after every chart or Hearth build): a centred text in a
 *  fixed box inside an auto-layout frame that hugs along the text's width becomes left-aligned in a box at its own width
 *  (whole pixels), so the hugging parent never lands on a half pixel. Run before layout. */
export function labelLeft(f: Frame): void {
  for (const c of f.children) {
    if (c.removed) continue;
    if (c.kind === "frame") { labelLeft(c); continue; }
    if (c.kind !== "text" || c.align !== "center" || c.sizing !== "fixed" || c.wrap || c.sizeW === "fill" || c.fillW) continue;
    const L = f.layout;
    // hugging along the text's width: a row's main axis or a column's cross axis, both the frame's width
    if (!L || f.sizeW !== "hug") continue;
    c.align = "left"; c.w = textWidth(c.text, c.style);
  }
}

/** Lay out an auto-layout frame and its descendants (hug sizes bottom-up, fill sizes from the parent). */
export function layout(f: Frame): void {
  const L = f.layout;
  const all = live(f);
  const kids = all.filter((c) => !c.abs);
  // an inside stroke takes room in auto layout (Figma default; the chart card turns it off)
  const sw = f.stroke && f.align === "inside" && f.strokesInLayout !== false ? (Array.isArray(f.sw) ? f.sw : [f.sw ?? 0, f.sw ?? 0, f.sw ?? 0, f.sw ?? 0]) : [0, 0, 0, 0];
  const [pt, pr, pb, pl] = L ? [L.pad[0] + sw[0], L.pad[1] + sw[1], L.pad[2] + sw[2], L.pad[3] + sw[3]] : [0, 0, 0, 0];
  // children first: hug sizes; fill children take the inner size of a fixed parent along the counter axis
  for (const c of all) {
    if (c.kind === "text" && c.fillW && L?.mode === "V" && f.sizeW !== "hug") { c.sizing = "fixed"; c.w = f.w - pl - pr; continue; }
    if (c.kind === "rect" && c.sizeW === "fill" && L?.mode === "V" && f.sizeW !== "hug") { c.w = f.w - pl - pr; continue; }
    if (c.kind !== "frame") continue;
    if (L?.mode === "V" && c.sizeW === "fill" && f.sizeW !== "hug") c.w = f.w - pl - pr;
    if (L?.mode === "H" && c.sizeH === "fill" && f.sizeH !== "hug") c.h = f.h - pt - pb;
    layout(c);
  }
  if (!L) return;
  // main-axis fill (layoutGrow 1): fill children share the room the others leave, in a fixed-size parent
  const grow = (c: Node) => (L.mode === "H" ? (c as Frame).sizeW === "fill" : (c as Frame).sizeH === "fill") && (c.kind === "frame" || c.kind === "rect" || c.kind === "text");
  const growers = kids.filter(grow);
  if (growers.length && !L.wrap && (L.mode === "H" ? f.sizeW !== "hug" : f.sizeH !== "hug")) {
    const inner = L.mode === "H" ? f.w - pl - pr : f.h - pt - pb;
    const used = kids.filter((c) => !grow(c)).reduce((s, c) => s + (L.mode === "H" ? c.w : c.h), 0) + L.gap * Math.max(0, kids.length - 1);
    const each = Math.max(0, (inner - used) / growers.length);
    for (const c of growers) { if (L.mode === "H") c.w = each; else c.h = each; if (c.kind === "text") c.sizing = "fixed"; if (c.kind === "frame") layout(c); }
  }
  if (L.mode === "H") {
    if (L.wrap) {
      const inner = f.w - pl - pr;
      const rows: Node[][] = [];
      let row: Node[] = [], used = 0;
      for (const c of kids) {
        if (row.length && used + L.gap + c.w > inner + 0.001) { rows.push(row); row = []; used = 0; }
        used += (row.length ? L.gap : 0) + c.w; row.push(c);
      }
      if (row.length) rows.push(row);
      let y = pt;
      rows.forEach((r, i) => {
        const rw = r.reduce((s, c) => s + c.w, 0) + L.gap * (r.length - 1);
        const rh = Math.max(...r.map((c) => c.h));
        let x = pl + (L.main === "CENTER" ? (inner - rw) / 2 : L.main === "MAX" ? inner - rw : 0);
        for (const c of r) { c.x = x; c.y = y + crossOff(L.cross, rh, c.h); x += c.w + L.gap; }
        y += rh + (i < rows.length - 1 ? L.wrapGap ?? 0 : 0);
      });
      if (f.sizeH === "hug") f.h = y + pb;
      return;
    }
    const sum = kids.reduce((s, c) => s + c.w, 0);
    const total = sum + L.gap * Math.max(0, kids.length - 1);
    if (f.sizeW === "hug") f.w = pl + total + pr;
    // baseline alignment (a row of texts): each child sits so the baselines meet (a non-text child's baseline is its foot)
    const base = (c: Node) => (c.kind === "text" ? baselineAt(c.style) : c.h);
    const mb = L.cross === "BASELINE" ? Math.max(0, ...kids.map(base)) : 0;
    const off = (c: Node) => Math.round(mb - base(c));
    if (f.sizeH === "hug") f.h = pt + Math.max(0, ...kids.map((c) => c.h + (L.cross === "BASELINE" ? off(c) : 0))) + pb;
    const inner = f.w - pl - pr, innerH = f.h - pt - pb;
    const between = L.main === "SPACE_BETWEEN" && kids.length > 1;
    // space between never goes below 0: content wider than the frame runs past its end, as in Figma
    const g = between ? Math.max(0, (inner - sum) / (kids.length - 1)) : L.gap;
    let x = pl + (between ? 0 : L.main === "CENTER" ? (inner - total) / 2 : L.main === "MAX" ? inner - total : 0);
    for (const c of kids) { c.x = x; c.y = pt + (L.cross === "BASELINE" ? off(c) : crossOff(L.cross, innerH, c.h)); x += c.w + g; }
  } else {
    const sum = kids.reduce((s, c) => s + c.h, 0);
    const total = sum + L.gap * Math.max(0, kids.length - 1);
    if (f.sizeH === "hug") f.h = pt + total + pb;
    if (f.sizeW === "hug") {
      // fill children of a hug column take the width the others give it (Figma)
      const fills = kids.filter((c) => c.kind === "frame" && c.sizeW === "fill") as Frame[];
      f.w = pl + Math.max(0, ...kids.filter((c) => !fills.includes(c as Frame)).map((c) => c.w)) + pr;
      for (const c of fills) { c.w = f.w - pl - pr; layout(c); }
    }
    const inner = f.h - pt - pb, innerW = f.w - pl - pr;
    const between = L.main === "SPACE_BETWEEN" && kids.length > 1;
    // space between never goes below 0: content wider than the frame runs past its end, as in Figma
    const g = between ? Math.max(0, (inner - sum) / (kids.length - 1)) : L.gap;
    let y = pt + (between ? 0 : L.main === "CENTER" ? (inner - total) / 2 : L.main === "MAX" ? inner - total : 0);
    for (const c of kids) { c.y = y; c.x = pl + crossOff(L.cross, innerW, c.w); y += c.h + g; }
  }
}
const crossOff = (a: Layout["cross"], room: number, size: number) => (a === "CENTER" ? (room - size) / 2 : a === "MAX" ? room - size : 0);

/** One drawn mark with absolute coordinates in the variant (the chart card). */
export type Clip = { x: number; y: number; w: number; h: number; r: Radius };
export type Mark = (Rect | Ellipse | Polygon | Vector | Text | (Frame & { children: [] })) & {
  path: string[]; ax: number; ay: number;
  /** the nearest clipping frame (clipsContent) above the mark, in card coordinates */
  clip?: Clip;
  /** vectors: the parent's offset, to move the path data (which is in the parent's coordinates) into the card */
  tx?: number; ty?: number;
};

/** Flatten a laid-out tree into marks: every leaf, plus frames that draw a fill or stroke. */
/** Boxes (root coordinates) of the frames a test picks, for click targets over a rendered SVG. */
export type Box = { x: number; y: number; w: number; h: number };
export function frameBoxes(root: Frame, pick: (f: Frame, path: string[]) => string | null): Record<string, Box> {
  const out: Record<string, Box> = {};
  const walk = (f: Frame, ox: number, oy: number, path: string[]) => {
    const ax = f === root ? 0 : ox + f.x, ay = f === root ? 0 : oy + f.y;
    const key = pick(f, path);
    if (key && !(key in out)) out[key] = { x: ax, y: ay, w: f.w, h: f.h };
    for (const c of live(f)) if (c.kind === "frame") walk(c, ax, ay, path.concat(f.name));
  };
  walk(root, 0, 0, []);
  return out;
}

export function flatten(root: Frame): Mark[] {
  const out: Mark[] = [];
  const walk = (n: Node, ox: number, oy: number, path: string[], clip: Clip | undefined) => {
    if (n.removed) return;
    const ax = n === root ? 0 : ox + n.x, ay = n === root ? 0 : oy + n.y;
    if (n.kind === "frame") {
      if (n.fill || n.stroke) out.push({ ...n, children: [], parent: undefined, path, ax, ay, clip } as Mark);
      const inner = n.clips && n !== root ? { x: ax, y: ay, w: n.w, h: n.h, r: n.radius ?? 0 } : clip;
      for (const c of live(n)) walk(c, ax, ay, n === root ? path : path.concat(n.name), inner);
      return;
    }
    // vectors keep their path in the parent's coordinates: the mark's box is the path box moved by the parent
    if (n.kind === "vector") out.push({ ...n, parent: undefined, path, ax: ox + n.x, ay: oy + n.y, tx: ox, ty: oy, clip } as Mark);
    else out.push({ ...n, parent: undefined, path, ax, ay, clip } as Mark);
  };
  walk(root, 0, 0, [], undefined);
  return out;
}
