// C.lollipop (Figma ember-chart.js): lollipop bars: a track and a bar per row, a ringed marker above the bar end
// with a dotted drop line down to the bar, the value to the left of the marker.
import type { Kit } from "../core/kit";
import { vector, type Frame } from "../core/node";

export type LollipopData = { max: number; rows: [label: string, v: number, tok: string, text: string][] };

export function lollipop(K: Kit, p: Frame, w: number, o: LollipopData): Frame {
  const pl = K.plot(p, "lollipop bars", w, K.PH);
  const n = o.rows.length, rh = Math.floor(K.PH / n);
  for (let i = 0; i < n; i++) {
    const [label, v, tok, text] = o.rows[i];
    const y = i * rh, bx = Math.round((v / o.max) * w), barY = y + rh - 14;
    const tr = K.rect(pl, "track · " + label.toLowerCase(), 0, barY, w, 10, "data/track", 5); tr.opacity = 0.6;
    K.rect(pl, "bar · " + label.toLowerCase(), 0, barY, bx, 10, tok, 5).motion = { kind: "reveal", order: i, group: i };
    // Figma: a LINE at (bx − 1, y + 16), length barY − (y + 16), rotated −90° (drawn downwards)
    const ln = vector(pl, "drop", `M ${bx - 1} ${y + 16} L ${bx - 1} ${barY}`, { stroke: { tok }, sw: 1, dash: [2, 2], cap: "butt" });
    ln.motion = { kind: "draw", order: i, group: i, after: true };
    K.ring(pl, "marker", bx - 1, y + 12, 8, tok).motion = { kind: "pop", order: i, group: i, after: true };
    const t = K.T(pl, "Label/S", text, "strong");
    t.x = Math.max(0, bx - 10 - Math.ceil(t.w)); t.y = y + 4;
    t.motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
