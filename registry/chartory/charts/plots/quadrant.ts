// C.quadrant (Figma ember-chart-4.js): points over a y grid split by two dividers into four named quadrants,
// coloured by quadrant, sized by r; a shown label takes the first free spot (right, left, below, above) that stays
// inside and clear of the quadrant names.
import { cell, place, type Kit } from "../core/kit";
import { remove, type Frame, type Text } from "../core/node";

export type QuadrantData = {
  pts: { label: string; x: number; y: number; r: number; show?: boolean }[];
  xmin: number; xmax: number; ymin: number; ymax: number; mx: number; my: number;
  ticks: string[]; xt: [number, string][]; quads: [string, string, string, string];
};

export function quadrant(K: Kit, p: Frame, w: number, o: QuadrantData): Frame {
  const pl = K.plot(p, "quadrant", w, K.PH);
  const yW = 36;
  K.yGrid(pl, o.ticks, yW, w);
  const x = (v: number) => yW + Math.round(((v - o.xmin) / (o.xmax - o.xmin)) * (w - yW)), y = (v: number) => K.yMap(v, o.ymin, o.ymax);
  K.rect(pl, "divider x", x(o.mx), K.TOP, 1, K.BASE - K.TOP, "body").opacity = 0.5;
  K.rect(pl, "divider y", yW, y(o.my), w - yW, 1, "body").opacity = 0.5;
  const q: [string, number, number, Text["align"]][] = [[o.quads[0], yW + 8, K.TOP + 6, "left"], [o.quads[1], w - 108, K.TOP + 6, "right"], [o.quads[2], yW + 8, K.BASE - 20, "left"], [o.quads[3], w - 108, K.BASE - 20, "right"]];
  // quadrant names keep their ink boxes; a point label that would touch one moves left, below or above its point
  const qs: { x: number; y: number; w: number; h: number }[] = [];
  for (const [t, xx, yy, al] of q) {
    const c = cell(K, pl, t, xx, yy, 100, "Label/Caps", "quiet", al);
    const m = K.caps(pl, t, "quiet"); const nw = Math.ceil(m.w); remove(m);
    qs.push({ x: al === "right" ? c.x + 100 - nw : c.x, y: c.y, w: nw, h: Math.ceil(c.h) });
  }
  const hits = (a: { x: number; y: number; w: number; h: number }) => qs.some((b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
  // points pop left to right
  const byX = [...o.pts].sort((a, b) => a.x - b.x);
  for (const d of o.pts) {
    const order = byX.indexOf(d);
    const tok = d.x >= o.mx ? (d.y >= o.my ? "status/success" : "status/warning") : d.y >= o.my ? "data/primary" : "status/danger";
    const s = 2 * d.r;
    const e = K.dot(pl, s, tok, "product · " + d.label.toLowerCase());
    e.opacity = 0.8; e.x = x(d.x) - d.r; e.y = y(d.y) - d.r;
    e.motion = { kind: "pop", order, group: order };
    if (d.show) {
      const t = K.caps(pl, d.label, "strong");
      const tw = Math.ceil(t.w), th = Math.ceil(t.h), px = x(d.x), py = y(d.y);
      const tries = [[px + d.r + 4, py - 7], [px - d.r - 4 - tw, py - 7], [px - Math.round(tw / 2), py + d.r + 2], [px - Math.round(tw / 2), py - d.r - 2 - th]];
      const ok = tries.find(([tx, ty]) => tx >= 0 && tx + tw <= w && !hits({ x: tx, y: ty, w: tw, h: th })) || tries[0];
      place(t, ok[0], ok[1]);
      t.motion = { kind: "fade", order, group: order, after: true };
    }
  }
  for (const [v, t] of o.xt) K.xAt(pl, t, x(v), K.PH - 14, v === o.xmin ? "start" : v === o.xmax ? "end" : "center");
  return pl;
}
