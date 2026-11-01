// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.sankey (Figma ember-chart.js): two columns of nodes (sources coloured, outcomes neutral) joined by flow ribbons at
// 32 %; labels (name over value, or one row each when the column cannot hold them stacked), then each column of
// labels is spread so no two touch (top-down, then pushed back up from the plot bottom).
import type { Kit } from "../core/kit";
import { collection, type Frame, layout } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type SankeyData = {
  left: { label: string; tok: string; v: number }[];
  right: { label: string; v: number }[];
  flows: [number, number, number][];
};

export function sankey(K: Kit, p: Frame, w: number, o: SankeyData): Frame {
  if (collection.signal) return signalPlot("sankey")(K, p, w, o); // Signal: charts/signal/plots/sankey.ts (@chartory/signal)
  const pl = K.plot(p, "sankey", w, K.PH);
  const g = 6, nw = 8;
  const tot = o.left.reduce((a, b) => a + b.v, 0);
  const kL = (K.PH - (o.left.length - 1) * g) / tot, kR = (K.PH - (o.right.length - 1) * g) / tot;
  const xl = 0, xr = w - nw;
  type N = { y: number; h: number; off: number };
  const L: N[] = [];
  let y = 0;
  for (const n of o.left) { const h = Math.round(n.v * kL); L.push({ y, h, off: 0 }); y += h + g; }
  const R: N[] = [];
  y = 0;
  for (const n of o.right) { const h = Math.round(n.v * kR); R.push({ y, h, off: 0 }); y += h + g; }
  o.flows.forEach(([li, ri, v], fi) => {
    const a = L[li], b = R[ri];
    const ha = v * kL, hb = v * kR;
    const y0 = a.y + a.off, y1 = b.y + b.off;
    a.off += ha; b.off += hb;
    const x0 = xl + nw, x1 = xr, xm = (x0 + x1) / 2;
    const f = (n: number) => +n.toFixed(2);
    const d = "M " + x0 + " " + f(y0) + " C " + xm + " " + f(y0) + " " + xm + " " + f(y1) + " " + x1 + " " + f(y1) + " L " + x1 + " " + f(y1 + hb) +
      " C " + xm + " " + f(y1 + hb) + " " + xm + " " + f(y0 + ha) + " " + x0 + " " + f(y0 + ha) + " Z";
    K.vec(pl, "flow · " + o.left[li].label.toLowerCase() + " → " + o.right[ri].label.toLowerCase(), d, { fill: o.left[li].tok, opacity: 0.32 })
      .motion = { kind: "reveal", order: o.left.length + fi, group: li };
  });
  const side = (nodes: { label: string; v: number }[], Y: N[], right: boolean, base: number) => {
    const cs: Frame[] = [];
    const one = nodes.length * 28 + (nodes.length - 1) * 2 > K.PH;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const c = K.AL(pl, "label · " + n.label.toLowerCase(), one ? "HORIZONTAL" : "VERTICAL", one ? { gap: 6, cross: "CENTER" } : right ? { cross: "MAX" } : {});
      const mo = { kind: "fade" as const, order: base + i, group: right ? undefined : i, after: true };
      K.T(c, "Label/S", n.label, "strong").motion = mo;
      K.caps(c, K.num(n.v), "body").motion = mo;
      layout(c);
      c.x = right ? xr - 8 - Math.ceil(c.w) : nw + 8;
      c.y = Y[i].y + Math.max(0, Math.round((Y[i].h - c.h) / 2));
      cs.push(c);
    }
    for (let i = 1; i < cs.length; i++) { const lim = cs[i - 1].y + Math.ceil(cs[i - 1].h) + 2; if (cs[i].y < lim) cs[i].y = lim; }
    for (let i = cs.length - 1; i >= 0; i--) {
      const lim = i === cs.length - 1 ? K.PH - Math.ceil(cs[i].h) : cs[i + 1].y - 2 - Math.ceil(cs[i].h);
      if (cs[i].y > lim) cs[i].y = Math.max(0, lim);
    }
  };
  for (let i = 0; i < o.left.length; i++)
    K.rect(pl, "source · " + o.left[i].label.toLowerCase(), xl, L[i].y, nw, L[i].h, o.left[i].tok, 2).motion = { kind: "grow", origin: "bottom", order: i, group: i };
  for (let i = 0; i < o.right.length; i++)
    K.rect(pl, "outcome · " + o.right[i].label.toLowerCase(), xr, R[i].y, nw, R[i].h, "text/action", 2).motion = { kind: "grow", origin: "bottom", order: o.left.length + o.flows.length + i };
  side(o.left, L, false, 0);
  side(o.right, R, true, o.left.length + o.flows.length);
  return pl;
}
