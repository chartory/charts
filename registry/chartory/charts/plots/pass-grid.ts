// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.passGrid (Figma ember-chart-5.js, type 99): models × eval suites. A tinted square per result with a check (pass),
// a cross (fail) or a dash (flaky) in the status colour; model names left, suite names under the columns (staggered on
// two rows, each using its neighbour's room, when one does not fit its column).
import { box, cell, overflows, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type PassGridData = { models: string[]; suites: string[]; m: ("p" | "f" | "x")[][] };

export function passGrid(K: Kit, p: Frame, w: number, o: PassGridData): Frame {
  const pl = K.plot(p, "pass fail grid", w, K.PH);
  const lW = 72, n = o.suites.length, k = o.models.length, cw = Math.floor((w - lW) / n);
  const rh = Math.floor((K.PH - (cw < 40 ? 36 : 22)) / k), s = Math.min(cw, rh) - 6;
  const stg = overflows(o.suites.map((x) => x.toUpperCase()), cw, "Label/Caps");
  for (let j = 0; j < n; j++) {
    if (stg) cell(K, pl, o.suites[j], lW + j * cw - Math.round(cw / 2), K.PH - (j % 2 ? 14 : 28), Math.min(2 * cw, w - (lW + j * cw - Math.round(cw / 2))), "Label/Caps", "axis");
    else cell(K, pl, o.suites[j], lW + j * cw, K.PH - 14, cw, "Label/Caps", "axis");
  }
  for (let i = 0; i < k; i++) {
    const t = K.T(pl, "Body/S", o.models[i], "strong");
    place(t, 0, i * rh + rh / 2 - t.h / 2);
    for (let j = 0; j < n; j++) {
      const v = o.m[i][j];
      const x = lW + j * cw + Math.round((cw - s) / 2), y = i * rh + Math.round((rh - s) / 2);
      const tok = v === "p" ? "status/success" : v === "f" ? "status/danger" : "status/warning";
      const mo = { kind: "fade" as const, order: i + j, group: i * n + j };
      box(K, pl, "cell", x, y, s, s, tok + "-bg", 5).motion = mo;
      const m = 6, cx = x + s / 2, cy = y + s / 2;
      if (v === "p") K.vec(pl, "pass", "M " + (x + m) + " " + cy + " L " + (cx - 2) + " " + (y + s - m) + " L " + (x + s - m) + " " + (y + m), { stroke: tok, sw: 2 }).motion = { ...mo };
      else if (v === "f") {
        K.vec(pl, "fail", "M " + (x + m) + " " + (y + m) + " L " + (x + s - m) + " " + (y + s - m), { stroke: tok, sw: 2 }).motion = { ...mo };
        K.vec(pl, "fail", "M " + (x + s - m) + " " + (y + m) + " L " + (x + m) + " " + (y + s - m), { stroke: tok, sw: 2 }).motion = { ...mo };
      } else K.vec(pl, "flaky", "M " + (x + m) + " " + cy + " L " + (x + s - m) + " " + cy, { stroke: tok, sw: 2 }).motion = { ...mo };
    }
  }
  return pl;
}
