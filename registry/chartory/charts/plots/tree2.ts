// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.tree2 (Figma ember-chart-2.js, type 40): a left-to-right dependency tree in columns (one per level, caps head on
// top): each item a card (shell fill, chip stroke, radius/item 8) with a status bar, its name and, when the cards are
// tall enough, a status row; parents centre on their children; curved links with a joint dot at the child.
// A name wider than its card wraps to two lines (and drops the status row); otherwise it truncates on one line.
import type { Kit } from "../core/kit";
import { fixTextWidth, layout, rect, wrapText, type Frame, type Motion, type Node } from "../core/node";

export type Tree2Item = { label: string; status: string; parent?: number; progress?: number };
export type Tree2Data = { heads: string[]; levels: Tree2Item[][] };


export function tree2(K: Kit, p: Frame, w: number, o: Tree2Data): Frame {
  const pl = K.plot(p, "tree", w, K.PH);
  const L = o.levels.length, gap = 28, cw = Math.floor((w - (L - 1) * gap) / L), top = 22;
  const nMax = Math.max(...o.levels.map((l) => l.length)), vg = 8;
  const ch = Math.min(40, Math.floor((K.PH - top - (nMax - 1) * vg) / nMax)), compact = ch < 36;
  const tone: Record<string, string> = { shipped: "status/success", "in progress": "status/info", review: "status/warning", blocked: "status/danger", todo: "text/unselected", release: "data/primary" };
  for (let l = 0; l < L; l++) K.xAt(pl, o.heads[l], l * (cw + gap), 0, "start");
  const pos: number[][] = [];
  const last = o.levels[L - 1];
  const tl = last.length * ch + (last.length - 1) * vg;
  let y = top + Math.round((K.PH - top - tl) / 2);
  pos[L - 1] = last.map(() => { const r = y; y += ch + vg; return r; });
  for (let l = L - 2; l >= 0; l--)
    pos[l] = o.levels[l].map((_, i) => {
      const kids = o.levels[l + 1].map((c, j) => (c.parent === i ? pos[l + 1][j] : null)).filter((v): v is number => v != null);
      return kids.length ? Math.round(kids.reduce((a, b) => a + b, 0) / kids.length) : top;
    });
  // reading order: a level's links and joints come in with its cards
  let gi = o.levels[0].length;
  for (let l = 1; l < L; l++)
    o.levels[l].forEach((it, i) => {
      const x0 = (l - 1) * (cw + gap) + cw, y0 = pos[l - 1][it.parent!] + ch / 2, x1 = l * (cw + gap), y1 = pos[l][i] + ch / 2, xm = x0 + gap / 2;
      const v = K.vec(pl, "link", "M " + x0 + " " + y0 + " C " + xm + " " + y0 + " " + xm + " " + y1 + " " + x1 + " " + y1, { stroke: "text/unselected", sw: 1, opacity: 0.6 });
      // pl.insertChild(0, v): links paint under everything (each new one goes first)
      pl.children.pop(); pl.children.unshift(v);
      v.motion = { kind: "draw", order: l, group: gi + i };
      const d = K.dot(pl, 6, "text/unselected", "joint"); d.x = x1 - 3; d.y = y1 - 3;
      d.motion = { kind: "pop", order: l, group: gi + i, after: true };
      if (i === o.levels[l].length - 1) gi += o.levels[l].length;
    });
  let g = 0;
  for (let l = 0; l < L; l++)
    for (let i = 0; i < o.levels[l].length; i++, g++) {
      const it = o.levels[l][i];
      const st = tone[it.status];
      const c = K.AL(pl, "node · " + it.label.toLowerCase(), "HORIZONTAL", { gap: 8, cross: "CENTER", pr: 8 });
      K.fixW(c, cw); K.fixH(c, ch);
      c.fill = { tok: "composer/shell" }; c.stroke = { tok: "chip/stroke" }; c.sw = 1; c.align = "inside"; c.radius = 8; c.clips = true;
      rect(c, "status bar", 0, 0, 3, ch, { tok: st });
      const col = K.AL(c, "text", "VERTICAL", { gap: 2 });
      const colW = cw - 2 - 3 - 8 - 8; // layoutGrow 1
      K.fixW(col, colW);
      const lt = K.T(col, "Label/S", it.label, "strong");
      const lw0 = Math.ceil(lt.w);
      fixTextWidth(lt, colW);
      const roomT = cw - 3 - 8 - 8 - 2;
      if (lw0 > roomT) wrapText(lt, colW);
      else lt.truncate = true;
      if (!compact) {
        const r = K.AL(col, "status", "HORIZONTAL", { gap: 5, cross: "CENTER" }); K.fill(r);
        K.dot(r, 5, st, "dot");
        const sx = K.caps(r, it.status.toUpperCase(), st === "text/unselected" ? "label" : st);
        fixTextWidth(sx, colW - 5 - 5); sx.truncate = true; sx.sizeW = "fill"; // fills the row (Signal: a 6 px dot leaves 96)
      }
      layout(c);
      c.x = l * (cw + gap); c.y = pos[l][i];
      const m: Motion = { kind: "fade", order: l, group: g };
      const tag = (n: Node) => { n.motion = m; if (n.kind === "frame") n.children.forEach(tag); };
      tag(c);
    }
  return pl;
}
