// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.blocks (Figma ember-chart.js): a column per squad, blocks stacked in proportion (the last block takes the rest),
// a title in each block of 22 px and more (fixed to the column when wider, dropped when it would not fit), a caps
// status at the block foot when the block is tall enough.
import type { Kit } from "../core/kit";
import { remove, wrapText, type Frame } from "../core/node";

export type BlocksData = { cols: { name: string; blocks: [number, string, string, string?][] }[] };

/** Workaround (core): Figma's textAutoResize HEIGHT wraps a fixed-width text at spaces and grows its height by lines;
 *  fixTextWidth keeps one line. The height is needed here (a title that no longer fits its block is dropped). */
export function blocks(K: Kit, p: Frame, w: number, o: BlocksData): Frame {
  const pl = K.plot(p, "block timeline", w, K.PH);
  const n = o.cols.length, g = 6;
  const cw = Math.floor((w - (n - 1) * g) / n);
  const top = 20;
  for (let i = 0; i < n; i++) {
    const col = o.cols[i], x = i * (cw + g);
    const t = K.caps(pl, col.name, "label"); t.x = x; t.y = 0;
    const tot = col.blocks.reduce((a, b) => a + b[0], 0);
    const avail = K.PH - top - (col.blocks.length - 1) * 4;
    let y = top;
    for (let k = 0; k < col.blocks.length; k++) {
      const [hv, tok, title, caps] = col.blocks[k];
      const h = k === col.blocks.length - 1 ? K.PH - y : Math.round((hv / tot) * avail);
      const group = i * 10 + k, order = i + k;
      K.rect(pl, "block · " + title.toLowerCase(), x, y, cw, h, tok, 4).motion = { kind: "fade", order, group };
      const dark = tok === "data/track";
      if (h >= 22) {
        const tt = K.T(pl, "Label/S", title, dark ? "body" : tok === "status/warning" ? "text/inverse" : "strong");
        if (Math.ceil(tt.w) + 14 > cw) wrapText(tt, cw - 14);
        tt.x = x + 7; tt.y = y + 6;
        if (tt.y + tt.h > y + h - 2) remove(tt);
        else {
          tt.motion = { kind: "fade", order, group, after: true };
          if (caps && h >= tt.h + 28) {
            const cp = K.caps(pl, caps, dark ? "axis" : tok === "status/warning" ? "text/inverse" : "strong");
            cp.x = x + 7; cp.y = y + h - 20;
            cp.motion = { kind: "fade", order, group, after: true };
          }
        }
      }
      y += h + 4;
    }
  }
  return pl;
}
