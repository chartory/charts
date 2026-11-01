// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.boxPlot (Figma ember-chart-3.js): one box per row on a y grid: whisker min → max with caps, the middle 50 % as a
// tinted box with a data/primary edge, the median as a 2 px bar, outliers as dots; labels under the boxes.
import { paint, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type BoxPlotData = { max: number; ticks: string[]; rows: { label: string; q: [number, number, number, number, number]; out?: number[] }[] };

export function boxPlot(K: Kit, p: Frame, w: number, o: BoxPlotData): Frame {
  const pl = K.plot(p, "box plot", w, K.PH);
  const yW = 40;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 8, w - yW - 8, o.rows.length, 1.2);
  const y = (v: number) => K.yMap(v, 0, o.max);
  for (let i = 0; i < o.rows.length; i++) {
    const r = o.rows[i], b = bs[i], nm = r.label.toLowerCase();
    const cx = b.x + Math.round(b.w / 2);
    const [mn, q1, md, q3, mx] = r.q;
    K.rect(pl, "whisker · " + nm, cx, y(mx), 1, y(mn) - y(mx), "body").motion = { kind: "grow", origin: "bottom", order: i, group: i };
    for (const [n, v] of [["cap max", mx], ["cap min", mn]] as const)
      K.rect(pl, n + " · " + nm, cx - 6, y(v), 13, 1, "body").motion = { kind: "fade", order: i, group: i };
    // the fill is its own layer under the outline, with node opacity (Figma drops paint opacity in instances / modes)
    const bf = K.rect(pl, "box · " + nm + " · fill", b.x, y(q3), b.w, y(q1) - y(q3), "data/primary", 3);
    bf.opacity = 0.28;
    bf.motion = { kind: "grow", origin: "bottom", order: i, group: i };
    const bx = K.rect(pl, "box · " + nm, b.x, y(q3), b.w, y(q1) - y(q3), null, 3);
    bx.stroke = paint("data/primary"); bx.sw = 1; bx.align = "inside";
    bx.motion = { kind: "grow", origin: "bottom", order: i, group: i };
    K.rect(pl, "median · " + nm, b.x, y(md) - 1, b.w, 2, "strong").motion = { kind: "fade", order: i, group: i, after: true };
    for (const v of r.out ?? []) {
      const d = K.dot(pl, 6, "body", "outlier");
      d.x = cx - 3; d.y = y(v) - 3;
      d.motion = { kind: "pop", order: i, group: i, after: true };
    }
    K.xAt(pl, r.label, cx, K.PH - 14, "center");
  }
  return pl;
}
