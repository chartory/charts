// C.semiDonut (Figma ember-chart-2.js, type 18): a half ring of segments from 9 o'clock to 3 o'clock (small gaps
// between them), the total centred on the hub, and a legend inside the plot with each share; on narrow plots (XS) the
// legend wraps into centred lines instead of running past the edges.
import { arc, ctr, type Kit } from "../core/kit";
import { layout, type Frame } from "../core/node";

export type SemiDonutData = { caps: string; value: string; items: { label: string; v: number; tok: string }[] };

export function semiDonut(K: Kit, p: Frame, w: number, o: SemiDonutData): Frame {
  const pl = K.plot(p, "semi donut", w, K.PH);
  const R = Math.min(Math.floor(w / 2) - 8, K.PH - 60), cx = Math.round(w / 2), cy = 8 + R;
  const tot = o.items.reduce((a, s) => a + s.v, 0);
  let a = Math.PI;
  const gap = 0.025;
  // arcs sweep from 9 o'clock in reading order (fade with order until a sweep kind exists)
  o.items.forEach((s, i) => {
    const b = a + (Math.PI * s.v) / tot;
    const e = arc(K, pl, "segment · " + s.label.toLowerCase(), cx, cy, R, 0.84, a + gap, b - gap, s.tok);
    e.motion = { kind: "sweep", order: i, group: i };
    a = b;
  });
  const c = ctr(K, pl, "summary", [["Label/Caps", o.caps, "label"], ["Display/M", o.value, "strong"]]);
  c.x = cx - Math.round(c.w / 2); c.y = cy - c.h;
  for (const t of c.children) t.motion = { kind: "fade", order: o.items.length, after: true };
  const lg = K.AL(pl, "legend", "HORIZONTAL", { gap: 16, cross: "CENTER" });
  for (const s of o.items) {
    const it = K.AL(lg, "legend · " + s.label.toLowerCase(), "HORIZONTAL", { gap: 6, cross: "CENTER" });
    K.dot(it, 6, s.tok, "swatch");
    K.caps(it, s.label.toUpperCase() + " " + Math.round((s.v / tot) * 100) + "%");
  }
  layout(lg);
  if (lg.w > w) {
    lg.layout = { ...lg.layout!, wrap: true, wrapGap: 6, main: "CENTER" };
    lg.sizeW = "fixed"; lg.w = w;
    layout(lg);
  }
  lg.x = cx - Math.round(lg.w / 2); lg.y = K.PH - Math.round(lg.h);
  return pl;
}
