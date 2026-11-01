// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.depth (Figma ember-chart-4.js, type 53): order book depth, cumulative bids (left) and asks (right) as stepped
// areas from the mid price, a dashed mid line with its chip, price ticks below.
import { chip, dash, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type DepthData = {
  bids: [number, number][]; asks: [number, number][]; mid: number; min: number; max: number; qmax: number;
  ticks: string[]; midText: string; xt: [number, string][];
};

export function depth(K: Kit, p: Frame, w: number, o: DepthData): Frame {
  const pl = K.plot(p, "depth", w, K.PH);
  const yW = 36;
  K.yGrid(pl, o.ticks, yW, w);
  const x = (v: number) => yW + Math.round(((v - o.min) / (o.max - o.min)) * (w - yW));
  const y = (q: number) => K.yMap(q, 0, o.qmax);
  for (const [side, tok, order] of [["bids", "status/success", 0], ["asks", "status/danger", 1]] as const) {
    const lv = o[side];
    const pts: [number, number][] = [[x(o.mid), K.BASE]];
    let prev = 0;
    for (const [pr, q] of lv) { pts.push([x(pr), y(prev)]); pts.push([x(pr), y(q)]); prev = q; }
    const edge = side === "bids" ? x(o.min) : x(o.max);
    pts.push([edge, y(prev)]);
    // both sides open outward from the mid price at once
    K.vec(pl, side + " · area", K.path(pts) + " L " + edge + " " + K.BASE + " Z", { fill: tok, opacity: 0.16 }).motion = { kind: "reveal", order, group: order };
    // the last step ends on the edge price, so the closing segment has no length: Figma stores that zero-length
    // segment as its own closed subpath ("M p L p Z"); same drawing, written the way Figma keeps it
    const [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 2];
    const ln = ex === px && ey === py ? K.path(pts.slice(0, -1)) + " M " + ex + " " + ey + " L " + ex + " " + ey + " Z" : K.path(pts);
    K.vec(pl, side + " · line", ln, { stroke: tok, sw: 1.5 }).motion = { kind: "draw", order, group: order };
  }
  dash(K, pl, "mid", "M " + x(o.mid) + " " + K.TOP + " L " + x(o.mid) + " " + K.BASE, "body");
  const mc = chip(K, pl, o.midText, "neutral", 0, K.TOP);
  mc.x = x(o.mid) - Math.round(mc.w / 2);
  for (const [v, t] of o.xt) K.xAt(pl, t, x(v), K.PH - 14, v === o.min ? "start" : v === o.max ? "end" : "center");
  return pl;
}
