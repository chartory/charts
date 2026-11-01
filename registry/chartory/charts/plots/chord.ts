// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.chord (Figma ember-chart-3.js): nodes as arcs around a ring (12 o'clock, clockwise, 0.06 rad gaps), sized by the
// flow in and out; ribbons between the arcs through the centre in the source colour at 38 %; the side list with each
// node's net flow. The radius leaves the list the width it needs to keep every row on one line (C.listNeed).
import { arc, arcPts, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import { textWidth } from "../core/text";

export type ChordData = { fmt: (v: number) => string; nodes: { label: string; tok: string }[]; flows: [number, number, number][] };

/** Width a side list needs to show every row on one line (C.listNeed, ember-chart.js). */
const listNeed = (rows: Row[]): number =>
  rows.reduce((m, r) => Math.max(m, (r.tok ? 16 : 0) + Math.ceil(textWidth(r.label, "Body/S")) + 12 + Math.ceil(textWidth(r.text ?? "", "Body/S"))), 0);

export function chord(K: Kit, p: Frame, w: number, o: ChordData): Frame {
  const pl = K.plot(p, "chord", w, K.PH);
  const net = o.nodes.map((_, i) => o.flows.reduce((s, f) => s + (f[1] === i ? f[2] : 0) - (f[0] === i ? f[2] : 0), 0));
  const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "");
  const need = listNeed(o.nodes.map((nd, i) => ({ label: nd.label, tok: nd.tok, text: sign(net[i]) + o.fmt(Math.abs(net[i])) })));
  const R = Math.floor(Math.min(K.PH - 12, w - 40 - need) / 2), cx = 8 + R, cy = Math.floor(K.PH / 2), rw = 10, gap = 0.06;
  const n = o.nodes.length;
  const tot = o.nodes.map((_, i) => o.flows.reduce((a, f) => a + (f[0] === i || f[1] === i ? f[2] : 0), 0));
  const all = tot.reduce((a, v) => a + v, 0), k = (2 * Math.PI - n * gap) / all;
  let a = -Math.PI / 2;
  const start: number[] = [];
  // arcs sweep from 12 o'clock: no sweep kind yet, so the node arcs fade in order around the ring
  for (let i = 0; i < n; i++) {
    start.push(a);
    arc(K, pl, "arc · " + o.nodes[i].label.toLowerCase(), cx, cy, R, (R - rw) / R, a, a + tot[i] * k, o.nodes[i].tok).motion = { kind: "sweep", order: i, group: i };
    a += tot[i] * k + gap;
  }
  const cur = start.slice();
  const seg = (i: number, v: number): [number, number] => { const s = cur[i]; cur[i] += v * k; return [s, cur[i]]; };
  const rr = R - rw - 2;
  o.flows.forEach(([f, t, v], fi) => {
    const [s0, s1] = seg(f, v), [t0, t1] = seg(t, v);
    const A = arcPts(cx, cy, rr, s0, s1), B = arcPts(cx, cy, rr, t0, t1);
    // the builder's " Q cx cy" curves through the centre; Figma stores them as cubics (control points ⅔ of the way
    // to the centre), so they are written as such here
    const q = (a: [number, number], b: [number, number]) => " C " + [(a[0] + 2 * cx) / 3, (a[1] + 2 * cy) / 3, (b[0] + 2 * cx) / 3, (b[1] + 2 * cy) / 3].map((v) => +v.toFixed(2)).join(" ") + " " + b.join(" ");
    const d = "M " + A[0].join(" ") + A.slice(1).map((pt) => " L " + pt.join(" ")).join("") + q(A[A.length - 1], B[0]) +
      B.slice(1).map((pt) => " L " + pt.join(" ")).join("") + q(B[B.length - 1], A[0]) + " Z";
    K.vec(pl, "ribbon · " + o.nodes[f].label.toLowerCase() + " → " + o.nodes[t].label.toLowerCase(), d, { fill: o.nodes[f].tok, opacity: 0.38 })
      .motion = { kind: "fade", order: n + fi, group: f };
  });
  K.sideList(pl, cx + R + 32, w - (cx + R + 32), o.nodes.map((nd, i) => ({
    label: nd.label, tok: nd.tok, text: sign(net[i]) + o.fmt(Math.abs(net[i])),
    tone: net[i] > 0 ? "status/success" : net[i] < 0 ? "status/danger" : "strong", pct: net[i] > 0 ? "NET IN" : "NET OUT",
  })));
  return pl;
}
