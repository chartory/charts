// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.icicle (Figma ember-chart-4.js): three rows (root, teams, projects) of boxes sized by value; a box of 56 px and
// more carries its name (Body/S) when it fits, and its value (caps) when the box is 40 px tall and the value fits.
import { cell, overflows, type Kit } from "../core/kit";
import type { Frame, Motion } from "../core/node";

export type IcicleData = { root: string; fmt: (v: number) => string; teams: { label: string; v: number; tok: string; kids: { label: string; v: number }[] }[] };

export function icicle(K: Kit, p: Frame, w: number, o: IcicleData): Frame {
  const pl = K.plot(p, "icicle", w, K.PH);
  const g = 2, rows = [[0, 34], [38, 52], [94, 56]];
  const tot = o.teams.reduce((a, t) => a + t.v, 0);
  // boxes fade in level by level, left to right
  let order = 0;
  const box = (name: string, x: number, y: number, bw: number, h: number, tok: string, op: number | null, title: string, val: string | null, group?: number) => {
    const m: Motion = { kind: "fade", order: order++, group };
    const r = K.rect(pl, name, x, y, bw, h, tok, 4);
    // opacity on the node, not the paint (Figma drops paint opacity in instances and modes)
    r.opacity = op ?? 1;
    r.motion = m;
    if (bw >= 56 && !overflows([title], bw - 16, "Body/S")) {
      cell(K, pl, title, x + 8, y + 6, bw - 16, "Body/S", "strong", "left").motion = { ...m, after: true };
      if (val && h >= 40 && !overflows([String(val).toUpperCase()], bw - 16, "Label/Caps")) cell(K, pl, val, x + 8, y + 24, bw - 16, "Label/Caps", "strong", "left").motion = { ...m, after: true };
    }
  };
  box("root", 0, rows[0][0], w, rows[0][1], "chipFill", null, o.root, null);
  let x = 0;
  for (let i = 0; i < o.teams.length; i++) {
    const t = o.teams[i];
    const tw = i === o.teams.length - 1 ? w - x : Math.round((t.v / tot) * (w + g)) - g;
    box("team · " + t.label.toLowerCase(), x, rows[1][0], tw, rows[1][1], t.tok, 1, t.label, o.fmt(t.v), i);
    let kx = x;
    const kt = t.kids.reduce((a, q) => a + q.v, 0);
    for (let j = 0; j < t.kids.length; j++) {
      const q = t.kids[j];
      const kw = j === t.kids.length - 1 ? x + tw - kx : Math.round((q.v / kt) * (tw + g)) - g;
      box("project · " + q.label.toLowerCase(), kx, rows[2][0], kw, rows[2][1], t.tok, 0.45, q.label, o.fmt(q.v), i);
      kx += kw + g;
    }
    x += tw + g;
  }
  return pl;
}
