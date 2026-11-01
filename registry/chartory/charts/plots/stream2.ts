// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.stream2 (Figma ember-chart-2.js): streamgraph centred on a middle line, month guide lines, layers outlined in the
// ground colour, a name + share label inside each layer where it is thick enough, a "now" line with an inverse chip.
import { X, tail, tok, type Kit } from "../core/kit";
import { layout, type Frame } from "../core/node";

export type Stream2Data = { now: number; nowLabel: string; xl: Record<number, string>; layers: { name: string; tok: string; vals: number[] }[] };

export function stream2(K: Kit, p: Frame, w: number, o: Stream2Data): Frame {
  const pl = K.plot(p, "streamgraph", w, K.PH);
  const n = o.layers[0].vals.length, top = 30, bot = K.PH - 22;
  const mid = Math.round((top + bot) / 2);
  const tot = o.layers[0].vals.map((_, i) => o.layers.reduce((a, l) => a + l.vals[i], 0));
  const k = (bot - top - 8) / Math.max(...tot);
  const xs = (i: number) => X(i, n, 0, w);
  for (let i = 0; i < n; i++) { const g = K.rect(pl, "month line " + (i + 1), xs(i), top - 4, 1, bot - top + 4, "grid"); g.opacity = 0.6; }
  let lower = tot.map((t) => -t / 2);
  const all = o.layers.reduce((a, l) => a + l.vals.reduce((x, y) => x + y, 0), 0);
  o.layers.forEach((l, li) => {
    const upper = lower.map((lo, i) => lo + l.vals[i]);
    const a = upper.map((v, i) => [xs(i), +(mid - v * k).toFixed(2)] as [number, number]);
    const b = lower.map((v, i) => [xs(i), +(mid - v * k).toFixed(2)] as [number, number]).reverse();
    const v = K.vec(pl, "layer · " + l.name, K.path(a, true) + " L " + b[0][0] + " " + b[0][1] + tail(K, b) + " Z", { fill: l.tok });
    v.stroke = { tok: tok(K.BG) }; v.sw = 1.5; v.join = "round";
    v.motion = { kind: "reveal", order: li, group: li };
    let bi = 1;
    for (let i = 1; i < n - 2; i++) {
      if (Math.abs(i - o.now) <= 1) continue;
      if (l.vals[i] > l.vals[bi] || Math.abs(bi - o.now) <= 1) bi = i;
    }
    const th = l.vals[bi] * k;
    if (th >= 16) {
      const c = K.AL(pl, "label · " + l.name, "HORIZONTAL", { gap: 6, cross: "CENTER" });
      K.caps(c, l.name.toUpperCase(), "strong");
      const sh = K.caps(c, Math.round((l.vals.reduce((x, y) => x + y, 0) / all) * 100) + "%", "strong");
      sh.opacity = 0.7;
      layout(c);
      const cy = mid - (lower[bi] + l.vals[bi] / 2) * k;
      c.x = Math.min(w - Math.ceil(c.w) - 4, Math.max(4, xs(bi) - Math.round(c.w / 2)));
      c.y = Math.round(cy - c.h / 2);
      c.motion = { kind: "fade", order: li, group: li, after: true };
    }
    lower = upper;
  });
  const nx = xs(o.now);
  const ln = K.rect(pl, "now line", nx, top - 4, 1, bot - top + 4, "text/strong"); ln.opacity = 0.5;
  const chip = K.AL(pl, "now chip", "HORIZONTAL", { pl: 6, pr: 6, cross: "CENTER", gap: 6 });
  K.fixH(chip, 20); chip.fill = { tok: "surface/inverse" }; chip.radius = 4;
  K.T(chip, "Label/Caps", o.nowLabel, "text/inverse");
  layout(chip);
  chip.x = Math.min(w - Math.ceil(chip.w), nx - Math.round(chip.w / 2)); chip.y = 2;
  for (const [i, t] of Object.entries(o.xl)) {
    const kk = +i;
    K.xAt(pl, t, xs(kk), K.PH - 14, kk === 0 ? "start" : kk === n - 1 ? "end" : "center");
  }
  return pl;
}
