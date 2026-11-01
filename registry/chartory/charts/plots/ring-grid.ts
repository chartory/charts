// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.ringGrid (Figma ember-chart-4.js): small progress rings in a 4-column grid, coloured by threshold (good /
// warn / below), the value centred, the name and a caps sub line below (lower-case Label/S when the caps overflow).
import { arc, cell, ctr, overflows, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type RingGridData = { items: { label: string; v: number; sub: string }[]; good: number; warn: number };

export function ringGrid(K: Kit, p: Frame, w: number, o: RingGridData): Frame {
  const pl = K.plot(p, "ring grid", w, K.PH);
  const cols = 4, rows = Math.ceil(o.items.length / cols), cw = Math.floor(w / cols), ch = Math.floor(K.PH / rows);
  const d = Math.min(56, 2 * Math.floor((ch - 42) / 2));
  for (let i = 0; i < o.items.length; i++) {
    const q = o.items[i];
    const cx = (i % cols) * cw + Math.round(cw / 2), top = Math.floor(i / cols) * ch + 2, cy = top + d / 2;
    const tok = q.v >= o.good ? "status/success" : q.v >= o.warn ? "status/info" : "status/warning";
    arc(K, pl, "track · " + q.label.toLowerCase(), cx, cy, d / 2, 0.84, 0, 2 * Math.PI, "data/track");
    // rings sweep from 12 o'clock: no sweep kind yet, so each value arc fades in, in reading order
    arc(K, pl, "value · " + q.label.toLowerCase(), cx, cy, d / 2, 0.84, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * q.v) / 100, tok).motion = { kind: "sweep", order: i, group: i };
    const c = ctr(K, pl, "pct", [["Label/S", q.v + "%", "strong"]]);
    place(c, cx - c.w / 2, cy - c.h / 2);
    for (const t of c.children) t.motion = { kind: "fade", order: i, group: i, after: true };
    const capFits = !overflows([q.sub.toUpperCase()], cw - 4, "Label/Caps");
    const lines: [string, StyleName, string, number][] = [[q.label, "Body/S", "strong", 6], [capFits ? q.sub : q.sub.toLowerCase(), capFits ? "Label/Caps" : "Label/S", "label", 24]];
    for (const [tx, st, tk, dy] of lines) cell(K, pl, tx, cx - Math.floor(cw / 2) + 2, top + d + dy, cw - 4, st, tk);
  }
  return pl;
}
