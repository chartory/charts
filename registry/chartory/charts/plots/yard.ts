// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.yard (Figma ember-chart-4.js, type 58): a row of numbered dock doors, a dashed apron line, then a grid of
// trailer slots (10 per row), coloured by state; empty doors and slots are outlined only (slots dashed).
import { cell, dash, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type YardData = { doors: string[]; slots: string[]; toks: Record<string, string> };

export function yard(K: Kit, p: Frame, w: number, o: YardData): Frame {
  const pl = K.plot(p, "yard map", w, K.PH);
  const nd = o.doors.length, dw = Math.floor((w - (nd - 1) * 4) / nd), doff = Math.floor((w - nd * dw - (nd - 1) * 4) / 2);
  for (let i = 0; i < nd; i++) {
    const x = doff + i * (dw + 4);
    const st = o.doors[i];
    const r = K.rect(pl, "door " + (i + 1), x, 0, dw, 26, o.toks[st], 4);
    if (st === "empty") { r.fill = undefined; r.stroke = { tok: "chip/stroke" }; r.sw = 1; r.align = "inside"; }
    // doors fade in left to right, then the yard in reading order
    r.motion = { kind: "fade", order: i, group: i };
    cell(K, pl, String(i + 1), x, 6, dw, "Label/Caps", st === "empty" ? "label" : "strong").motion = { kind: "fade", order: i, group: i, after: true };
  }
  dash(K, pl, "apron", "M 0 36 L " + w + " 36", "grid");
  const cols = 10, sw = Math.floor((w - (cols - 1) * 6) / cols), soff = Math.floor((w - cols * sw - (cols - 1) * 6) / 2);
  for (let i = 0; i < o.slots.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const st = o.slots[i];
    const x = soff + c * (sw + 6), y = 46 + r * 26;
    const b = K.rect(pl, "slot " + (i + 1), x, y, sw, 18, o.toks[st], 3);
    if (st === "empty") { b.fill = undefined; b.stroke = { tok: "chip/stroke" }; b.sw = 1; b.align = "inside"; b.dash = [3, 2]; }
    b.motion = { kind: "fade", order: nd + i, group: nd + i };
  }
  return pl;
}
