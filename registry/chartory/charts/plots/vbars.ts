// C.vBars (Figma ember-chart.js): vertical bars without a y axis, value labels inside the bar top (flat) or along the
// bar (rot, turned 90°), category labels under each bar, an optional dashed reference line with its label.
import type { Kit } from "../core/kit";
import { collection, fixTextWidth, type Frame, vector } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type VBarsData = {
  cats: string[]; vals: number[]; toks: string[]; max: number;
  shape: "pill" | "top"; inside: "rot" | "flat"; ratio?: number; fmt: (v: number) => string;
  ref?: { v: number; label: string; tok: string };
};

export function vBars(K: Kit, p: Frame, w: number, o: VBarsData): Frame {
  if (collection.signal) return signalPlot("vbars")(K, p, w, o); // Signal: charts/signal/plots/vbars.ts (@chartory/signal)
  const pl = K.plot(p, "bars", w, K.PH);
  const base = K.PH - 22, top = 4;
  const bs = K.bands(0, w, o.cats.length, o.ratio ?? 0.25);
  for (let i = 0; i < o.cats.length; i++) {
    const b = bs[i];
    const h = Math.round((o.vals[i] / o.max) * (base - top));
    const tok = o.toks[i];
    const bar = K.rect(pl, "bar · " + o.cats[i].toLowerCase(), b.x, base - h, b.w, h, tok, o.shape === "pill" ? Math.floor(b.w / 2) : [4, 4, 0, 0]);
    bar.motion = { kind: "grow", origin: "bottom", order: i, group: i };
    const t = K.caps(pl, o.fmt(o.vals[i]), tok === "data/track" ? "body" : "strong");
    t.name = "value · " + o.cats[i].toLowerCase();
    t.motion = { kind: "fade", order: i, group: i, after: true };
    if (o.inside === "rot") {
      const tw = Math.ceil(t.w);
      fixTextWidth(t, tw); t.rotation = 90;
      t.x = b.x + Math.round((b.w - 14) / 2); t.y = base - Math.floor(b.w / 2) + 2;
    } else { t.x = Math.round(b.x + (b.w - Math.ceil(t.w)) / 2); t.y = base - 20; }
    K.xAt(pl, o.cats[i], b.x + Math.round(b.w / 2), K.PH - 14, "center");
  }
  if (o.ref) {
    const y = base - Math.round((o.ref.v / o.max) * (base - top));
    const ln = vector(pl, "reference · " + o.ref.label.toLowerCase(), `M 0 ${y} L ${w} ${y}`, { stroke: { tok: o.ref.tok }, sw: 1, dash: [4, 4] });
    void ln;
    const t = K.caps(pl, o.ref.label, o.ref.tok);
    t.x = w - Math.ceil(t.w); t.y = y - 18;
  }
  return pl;
}
