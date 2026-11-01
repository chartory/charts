// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.batteries (Figma ember-chart-4.js): a grid of battery cells (4 per row): outline, terminal, a charge bar in the
// status colour (danger under 25 %, warning under 50 %), the name and a caps line (charge and range, or CHARGING;
// short form in cells under 100 px).
import { cell, outline, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type BatteriesData = { items: { label: string; v: number; sub: string; charging?: boolean }[] };

export function batteries(K: Kit, p: Frame, w: number, o: BatteriesData): Frame {
  const pl = K.plot(p, "batteries", w, K.PH);
  const cols = 4, cw = Math.floor(w / cols), ch = Math.floor(K.PH / 2), bw = 64, bh = 28;
  for (let i = 0; i < o.items.length; i++) {
    const q = o.items[i];
    const x = (i % cols) * cw, y = Math.floor(i / cols) * ch + 4;
    const bx = x + Math.round((cw - bw - 4) / 2);
    const tok = q.v < 25 ? "status/danger" : q.v < 50 ? "status/warning" : "status/success";
    outline(K.rect(pl, "battery · " + q.label.toLowerCase(), bx, y, bw, bh, null, 6), "body", 1.5);
    K.rect(pl, "terminal", bx + bw + 1, y + 9, 3, 10, "body", 1);
    K.rect(pl, "charge", bx + 4, y + 4, Math.max(4, Math.round(((bw - 8) * q.v) / 100)), bh - 8, tok, 3).motion = { kind: "grow", origin: "left", order: i, group: i };
    cell(K, pl, q.label, x + 2, y + bh + 8, cw - 4, "Body/S", "strong");
    const sub = cw < 100 ? q.v + "%" + (q.charging ? " · CHG" : "") : q.charging ? "CHARGING · " + q.v + "%" : q.v + "% · " + q.sub;
    cell(K, pl, sub, x + 2, y + bh + 26, cw - 4, "Label/Caps", q.charging ? "status/info" : "label").motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
