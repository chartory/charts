// C.slope (Figma ember-chart-3.js): two value axes (before / after), one line per row green up / red down with ringed
// ends, the before value left of the left axis and the name + after value right of the right axis; each side of
// labels is spread so no two touch (2026-10-12), within the plot base.
import type { Kit } from "../core/kit";
import { layout, type Frame, type Text } from "../core/node";

export type SlopeData = { left: string; right: string; min: number; max: number; fmt: (v: number) => string; rows: { label: string; a: number; b: number }[] };

export function slope(K: Kit, p: Frame, w: number, o: SlopeData): Frame {
  const pl = K.plot(p, "slope", w, K.PH);
  const x0 = 64, x1 = w - 150;
  const y = (v: number) => K.yMap(v, o.min, o.max);
  const L: Text[] = [], R: Frame[] = [];
  for (const [x, t] of [[x0, o.left], [x1, o.right]] as const) {
    K.rect(pl, "axis · " + t.toLowerCase(), x, K.TOP, 1, K.BASE - K.TOP, "grid");
    K.xAt(pl, t, x, K.PH - 14, "center");
  }
  o.rows.forEach((r, i) => {
    const up = r.b >= r.a, t = up ? "status/success" : "status/danger", ya = y(r.a), yb = y(r.b), nm = r.label.toLowerCase();
    K.vec(pl, "line · " + nm, "M " + x0 + " " + ya + " L " + x1 + " " + yb, { stroke: t, sw: 2 }).motion = { kind: "draw", order: i, group: i };
    for (const [x, yy] of [[x0, ya], [x1, yb]]) {
      const d = K.ring(pl, "dot · " + nm, x, yy, 10, t);
      d.sw = 2; d.x = Math.round(d.x); d.y = Math.round(d.y);
      d.motion = { kind: "pop", order: i, group: i, after: true };
    }
    const la = K.caps(pl, o.fmt(r.a), "axis");
    la.name = "left · " + nm; la.x = x0 - 12 - Math.ceil(la.w); la.y = ya - 7;
    la.motion = { kind: "fade", order: i, group: i, after: true };
    L.push(la);
    const row = K.AL(pl, "right · " + nm, "HORIZONTAL", { gap: 8, cross: "CENTER" });
    const mo = { kind: "fade" as const, order: i, group: i, after: true };
    K.T(row, "Body/S", r.label, "strong").motion = mo;
    K.caps(row, o.fmt(r.b), t).motion = mo;
    layout(row);
    row.x = x1 + 14; row.y = yb - Math.round(row.h / 2);
    R.push(row);
  });
  const spread = (cs: (Text | Frame)[]) => {
    cs.sort((a, b) => a.y - b.y);
    for (let i = 1; i < cs.length; i++) { const lim = cs[i - 1].y + Math.ceil(cs[i - 1].h) + 2; if (cs[i].y < lim) cs[i].y = lim; }
    for (let i = cs.length - 1; i >= 0; i--) {
      const lim = i === cs.length - 1 ? K.BASE - Math.ceil(cs[i].h) : cs[i + 1].y - 2 - Math.ceil(cs[i].h);
      if (cs[i].y > lim) cs[i].y = Math.max(0, lim);
    }
  };
  spread(L); spread(R);
  return pl;
}
