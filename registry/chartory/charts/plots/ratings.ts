// C.ratings (Figma ember-chart-5.js, type 93): five stars filled to the average (the partial star clipped by a frame),
// the average in Display/M with a caps caption, and one bar per star level (track, count bar, count on the right).
import { box, place, star, type Kit } from "../core/kit";
import { frame, type Frame } from "../core/node";

export type RatingsData = { avg: number; rows: [number, number][] };

export function ratings(K: Kit, p: Frame, w: number, o: RatingsData): Frame {
  const pl = K.plot(p, "ratings", w, K.PH);
  const lW = 150, k = o.rows.length, rh = Math.floor((K.PH - 4) / k), mx = Math.max(...o.rows.map((r) => r[1]));
  for (let i = 0; i < 5; i++) {
    const cx = 14 + i * 26, cy = 54;
    const f = Math.max(0, Math.min(1, o.avg - i));
    const d = K.path(star(cx, cy, 12, 5)) + " Z";
    K.vec(pl, "star track", d, { fill: "data/track" });
    if (f > 0) {
      if (f < 1) {
        // the partial star: a clipping frame cut to the filled share; the star's path moves into the frame's space
        const fz = frame(pl, "partial star", { w: Math.round(24 * f), h: 26, sizeW: "fixed", sizeH: "fixed", x: cx - 12, y: cy - 13, clips: true });
        const pts = star(cx, cy, 12, 5).map(([x, y]) => [+(x - fz.x).toFixed(2), +(y - fz.y).toFixed(2)] as [number, number]);
        K.vec(fz, "star fill", K.path(pts) + " Z", { fill: "status/warning" }).motion = { kind: "pop", order: i };
      } else K.vec(pl, "star fill", d, { fill: "status/warning" }).motion = { kind: "pop", order: i };
    }
  }
  const big = K.T(pl, "Display/M", o.avg.toFixed(1), "strong");
  place(big, 0, 78);
  big.motion = { kind: "fade", order: 5, after: true };
  const cap = K.caps(pl, "AVERAGE RATING", "label");
  place(cap, 0, 78 + big.h + 2);
  for (let r = 0; r < k; r++) {
    const [s, n] = o.rows[r];
    const y = r * rh + Math.round(rh / 2);
    const t = K.caps(pl, s + " STAR", "body");
    place(t, lW, y - 7);
    box(K, pl, "track", lW + 56, y - 4, w - lW - 56 - 52, 8, "data/track", 4);
    box(K, pl, "count · " + s, lW + 56, y - 4, Math.max(8, Math.round((n / mx) * (w - lW - 56 - 52))), 8, s >= 4 ? "status/warning" : s === 3 ? "body" : "status/danger", 4)
      .motion = { kind: "grow", origin: "left", order: r, group: r };
    const c = K.caps(pl, K.num(n), "strong");
    place(c, w - Math.ceil(c.w), y - 7);
    c.motion = { kind: "fade", order: r, group: r, after: true };
  }
  return pl;
}
