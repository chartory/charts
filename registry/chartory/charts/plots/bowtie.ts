// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.bowtie (Figma ember-chart-5.js, type 87): stages as trapezoids narrowing to the knot and widening after it
// (left = cat-2, knot = strong, right = data/primary; opacity by position), with caps names and values under them
// (names staggered on two rows when one overflows its slot).
import { cell, overflows, tri, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

type Seg = { label: string; v: number; text?: string };
export type BowtieData = { fmt: (v: number) => string; left: Seg[]; knot: Seg; right: Seg[] };

export function bowtie(K: Kit, p: Frame, w: number, o: BowtieData): Frame {
  const pl = K.plot(p, "bowtie", w, K.PH);
  const segs = [...o.left, o.knot, ...o.right];
  const n = segs.length, sw = Math.floor(w / n);
  const stag = overflows(segs.map((x) => x.label.toUpperCase()), sw - 2, "Label/Caps");
  const mh = Math.min(96, K.PH - (stag ? 72 : 80)), cy = 6 + Math.round(mh / 2), ly = stag ? mh + 14 : Math.min(Math.max(118, mh + 22), K.PH - 34);
  const mx = Math.max(...segs.map((s) => s.v));
  const h = (v: number) => Math.max(10, Math.round((v / mx) * mh));
  for (let i = 0; i < n; i++) {
    const s = segs[i];
    const x0 = i * sw + 1, x1 = (i + 1) * sw - 1;
    const hl = h(s.v), hr = i < n - 1 ? h(segs[i + 1].v) : h(s.v);
    const left = i < o.left.length, knot = i === o.left.length;
    const tok = knot ? "strong" : left ? "data/cat-2" : "data/primary";
    tri(K, pl, "stage · " + s.label.toLowerCase(), [[x0, cy - hl / 2], [x1, cy - hr / 2], [x1, cy + hr / 2], [x0, cy + hl / 2]], tok,
      knot ? 0.9 : 0.35 + 0.5 * (left ? 1 - i / n : (i - o.left.length) / n)).motion = { kind: "reveal", order: i, group: i };
    if (stag) {
      const lw = 2 * sw - 2, lx = Math.max(0, Math.min(w - lw, x0 - Math.round(sw / 2)));
      cell(K, pl, s.label, lx, ly + (i % 2 ? 14 : 0), lw, "Label/Caps", "body");
      cell(K, pl, s.text ?? o.fmt(s.v), x0, ly + 30, sw - 2, "Body/S", "strong").motion = { kind: "fade", order: i, group: i, after: true };
    } else {
      cell(K, pl, s.label, x0, ly, sw - 2, "Label/Caps", "body");
      cell(K, pl, s.text ?? o.fmt(s.v), x0, ly + 16, sw - 2, "Body/S", "strong").motion = { kind: "fade", order: i, group: i, after: true };
    }
  }
  return pl;
}
