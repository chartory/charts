// C.flame (Figma ember-chart-4.js): a flame graph of spans by depth on a time axis; the root span at 0.55 opacity,
// a label inside every span of 40 px and more that fits it, tick marks and labels under the deepest row.
import { place, type Kit } from "../core/kit";
import { remove, type Frame } from "../core/node";

export type FlameData = { total: number; xt: [number, string][]; spans: { label: string; d: number; s: number; e: number; tok: string }[] };

export function flame(K: Kit, p: Frame, w: number, o: FlameData): Frame {
  const pl = K.plot(p, "flame graph", w, K.PH);
  const rh = 24, g = 2;
  const x = (t: number) => Math.round((t / o.total) * w);
  // spans grow down the stack: by depth, then left to right
  const order = o.spans.map((_, i) => i).sort((a, b) => o.spans[a].d - o.spans[b].d || o.spans[a].s - o.spans[b].s);
  o.spans.forEach((s, i) => {
    const k = order.indexOf(i);
    const x0 = x(s.s), x1 = x(s.e) - g;
    const y = s.d * (rh + g);
    const r = K.rect(pl, "span · " + s.label.toLowerCase(), x0, y, Math.max(2, x1 - x0), rh, s.tok, 3);
    r.opacity = s.d === 0 ? 0.55 : 1;
    r.motion = { kind: "grow", origin: "left", order: k, group: i };
    if (x1 - x0 >= 40) {
      const t = K.T(pl, "Label/S", s.label, "strong");
      t.name = "label";
      if (Math.ceil(t.w) > x1 - x0 - 12) remove(t);
      else { place(t, x0 + 6, y + Math.round((rh - t.h) / 2)); t.motion = { kind: "fade", order: k, group: i, after: true }; }
    }
  });
  for (const [v, t] of o.xt) {
    K.rect(pl, "tick · " + t, x(v), 5 * (rh + g) + 2, 1, 6, "grid");
    K.xAt(pl, t, x(v), K.PH - 14, v === 0 ? "start" : v === o.total ? "end" : "center");
  }
  return pl;
}
