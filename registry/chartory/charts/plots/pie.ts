// C.pie (Figma ember-chart.js): pie or ring (inner > 0) of arc slices from 12 o'clock, an optional full track, an
// optional centred value + caps, and the side list (C.sideList, rows 36 px). The diameter leaves the list the width
// it needs to keep every row on one line (C.listNeed), at least 112 px.
import { type Kit, paint, type Row } from "../core/kit";
import { collection, ellipse, type Frame, layout } from "../core/node";
import { textWidth } from "../core/text";
import { signalPlot } from "../core/signal-hook";

export type PieData = {
  slices: { label: string; v: number; tok: string }[];
  rows: Row[];
  inner?: number; track?: boolean; of?: number; sep?: boolean; d?: number;
  center?: { value: string; caps: string };
};

/** Width a side list needs to show every row on one line: swatch + name + gap + value (C.listNeed). */
export const listNeed = (rows: Row[]): number =>
  rows.reduce((m, r) => Math.max(m, (r.tok ? 16 : 0) + Math.ceil(textWidth(r.label, "Body/S")) + 12 + Math.ceil(textWidth(r.text ?? "", "Body/S"))), 0);

export function pie(K: Kit, p: Frame, w: number, o: PieData): Frame {
  if (collection.signal) return signalPlot("pie")(K, p, w, o); // Signal: charts/signal/plots/pie.ts (@chartory/signal)
  const pl = K.plot(p, o.inner ? "ring" : "pie", w, K.PH);
  const need = listNeed(o.rows);
  const d0 = o.d ?? Math.min(168, K.PH - 16, w - (w < 400 ? 24 : 40) - 8 - Math.max(112, need));
  const d = d0 - (d0 % 2), x0 = 8, y0 = Math.floor((K.PH - d) / 2);
  const tot = o.slices.reduce((a, s) => a + s.v, 0);
  let a = -Math.PI / 2;
  if (o.track) ellipse(pl, "track", x0, y0, d, d, { fill: paint("data/track"), arc: { start: 0, end: 2 * Math.PI, inner: o.inner ?? 0 } });
  // arcs sweep from 12 o'clock: no sweep kind yet, so the slices fade in order around the ring
  o.slices.forEach((s, i) => {
    const b = a + (2 * Math.PI * s.v) / (o.of ?? tot);
    const e = ellipse(pl, "slice · " + s.label.toLowerCase(), x0, y0, d, d, { fill: paint(s.tok), arc: { start: a, end: b, inner: o.inner ?? 0 } });
    if (!o.inner || o.sep) { e.stroke = paint(K.BG); e.sw = 2; e.align = "center"; }
    e.motion = { kind: "sweep", order: i, group: i };
    a = b;
  });
  if (o.center) {
    const c = K.AL(pl, "centre", "VERTICAL", { cross: "CENTER", gap: 2 });
    K.T(c, "Display/M", o.center.value, "strong");
    K.caps(c, o.center.caps);
    layout(c);
    c.x = x0 + Math.round((d - c.w) / 2); c.y = y0 + Math.round((d - c.h) / 2);
    for (const t of c.children) t.motion = { kind: "fade", order: o.slices.length, after: true };
  }
  const lx = x0 + d + (w < 400 ? 24 : 40);
  K.sideList(pl, lx, w - lx, o.rows.map((r) => ({ ...r, h: 36 })));
  return pl;
}
