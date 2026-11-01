// C.cloud (Figma ember-chart-4.js): terms in a centred wrapping row, sized by weight in five tiers (Body/S → Display/M),
// coloured by tone (negative / positive, else strong from 0.45 up, body below). Every term stays at every size
// (the person, 2026-10-12): when the cloud is taller than the plot, the gaps tighten first, then the top tiers step
// down one style at a time; the smallest tier stays Body/S.
import type { Kit } from "../core/kit";
import { layout, remove, type Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type CloudData = { words: [string, number, ("neg" | "pos")?][] };

const RAMP: StyleName[] = ["Body/S", "Body/M", "Heading/S", "Body/L", "Display/M"];
const tier = (wt: number) => (wt >= 0.85 ? 4 : wt >= 0.65 ? 3 : wt >= 0.45 ? 2 : wt >= 0.25 ? 1 : 0);
const tokOf = (wt: number, tone?: string) => (tone === "neg" ? "status/danger" : tone === "pos" ? "status/success" : wt >= 0.45 ? "strong" : "body");

export function cloud(K: Kit, p: Frame, w: number, o: CloudData): Frame {
  const pl = K.plot(p, "term cloud", w, K.PH);
  const f = K.AL(pl, "terms", "HORIZONTAL", { gap: 14, main: "CENTER", cross: "CENTER" });
  f.layout = { ...f.layout!, wrap: true, wrapGap: 6 };
  f.w = w; f.sizeW = "fixed";
  const draw = (cap: number) => {
    for (const ch of [...f.children]) remove(ch);
    // text clouds fade in by weight: the heaviest term first
    const rank = [...o.words].sort((a, b) => b[1] - a[1]).map((w) => w[0]);
    o.words.forEach(([t, wt, tone], i) => {
      const x = K.T(f, RAMP[Math.min(tier(wt), cap)], t, tokOf(wt, tone));
      x.name = "term · " + t.toLowerCase();
      x.motion = { kind: "fade", order: rank.indexOf(t), group: i };
    });
    layout(f);
  };
  draw(4);
  if (f.h > K.PH) { f.layout = { ...f.layout!, gap: 8, wrapGap: 2 }; layout(f); }
  for (let cap = 3; f.h > K.PH && cap >= 0; cap--) draw(cap);
  f.x = 0; f.y = Math.max(0, Math.round((K.PH - f.h) / 2));
  return pl;
}
