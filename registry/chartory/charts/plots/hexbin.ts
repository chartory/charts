// C.hexbin (Figma ember-chart.js): density small multiples. Per panel a staggered grid of hexagon bins (12 × 10 px
// pitch, 11 × 12 px) whose density is a sum of Gaussian blobs in the page outline's unit space; bins under 0.12 are
// skipped, the rest are data/primary at 0.15 + 0.85 × density; a dashed outline (the page), name and caps under it.
//
// Figma draws each bin as a POLYGON (pointCount 6): a regular hexagon fitted to its 11 × 12 box, pointy top.
import { paint, type Kit } from "../core/kit";
import { polygon, rect, type Frame } from "../core/node";

export type HexbinData = { panels: { name: string; sub: string; blobs: [number, number, number, number][] }[] };

export function hexbin(K: Kit, p: Frame, w: number, o: HexbinData): Frame {
  const pl = K.plot(p, "hexbin", w, K.PH);
  const n = o.panels.length, gap = 16;
  const pw = Math.floor((w - (n - 1) * gap) / n);
  const ah = K.PH - 44;
  for (let q = 0; q < n; q++) {
    const P = o.panels[q], x0 = q * (pw + gap);
    const fw = Math.round(pw * 0.62), fh = Math.round(ah * 0.78), fx = x0 + Math.round((pw - fw) / 2), fy = Math.round((ah - fh) / 2);
    for (let r = 0; r * 10 + 12 <= ah; r++)
      for (let c = 0; c * 12 + 12 + (r % 2 ? 6 : 0) <= pw; c++) {
        const hx = x0 + c * 12 + (r % 2 ? 6 : 0), hy = r * 10;
        const ux = (hx + 6 - fx) / fw, uy = (hy + 6 - fy) / fh;
        let d = 0;
        for (const [bx, by, s, a] of P.blobs) d += a * Math.exp(-((ux - bx) ** 2 + (uy - by) ** 2) / (2 * s * s));
        if (d < 0.12) continue;
        const h = polygon(pl, "bin " + r + "·" + c, hx, hy, 11, 12, 6, { fill: paint("data/primary") });
        h.opacity = Math.round(Math.min(1, 0.15 + d * 0.85) * 100) / 100;
        h.motion = { kind: "fade", order: q * 4 + Math.round(d * 3), group: q };
      }
    const fr = rect(pl, "outline · " + P.name.toLowerCase(), fx, fy, fw, fh);
    fr.stroke = paint("text/strong"); fr.sw = 1; fr.dash = [3, 3]; fr.opacity = 0.6; fr.align = "inside";
    const t = K.T(pl, "Label/S", P.name, "strong"); t.x = x0 + Math.round((pw - Math.ceil(t.w)) / 2); t.y = ah + 6;
    const s = K.caps(pl, P.sub); s.x = x0 + Math.round((pw - Math.ceil(s.w)) / 2); s.y = ah + 24;
  }
  return pl;
}
