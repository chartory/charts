// C.bubbles (Figma ember-chart.js): packed bubbles, largest first, each placed on a 2 px grid at the free spot closest
// to the centre (x weighted 0.55); tinted by the sign of the change with a 1 px status ring inside; name and change
// inside bubbles of radius 22 and more, the name alone from 17.
import { paint, type Kit } from "../core/kit";
import { ellipse, layout, type Frame } from "../core/node";

export type BubblesData = { items: { label: string; v: number; chg: number }[]; rMax?: number };

export function bubbles(K: Kit, p: Frame, w: number, o: BubblesData): Frame {
  const H = K.PH - 4, pl = K.plot(p, "bubbles", w, K.PH);
  const vmax = Math.max(...o.items.map((i) => i.v));
  const rMax = Math.min(o.rMax ?? 999, Math.floor(H / 2) - 4, Math.floor(w / 6));
  const placed: { x: number; y: number; s: number; r: number; it: BubblesData["items"][number] }[] = [];
  for (const it of [...o.items].sort((a, b) => b.v - a.v)) {
    const r = Math.max(7, Math.round(rMax * Math.sqrt(it.v / vmax)));
    let best: { x: number; y: number; s: number } | null = null;
    for (let x = r; x <= w - r; x += 2)
      for (let y = r + 2; y <= H - r; y += 2) {
        if (placed.some((q) => Math.hypot(q.x - x, q.y - y) < q.r + r + 4)) continue;
        const s = Math.hypot((x - w / 2) * 0.55, y - H / 2);
        if (!best || s < best.s) best = { x, y, s };
      }
    if (!best) continue;
    placed.push({ ...best, r, it });
  }
  placed.forEach((q, i) => {
    const up = q.it.chg >= 0;
    const e = ellipse(pl, "bubble · " + q.it.label.toLowerCase(), q.x - q.r, q.y - q.r, 2 * q.r, 2 * q.r,
      { fill: paint(up ? "status/success-bg" : "status/danger-bg"), stroke: paint(up ? "status/success" : "status/danger"), sw: 1, align: "inside" });
    e.motion = { kind: "pop", order: i, group: i };
    const mo = { kind: "fade" as const, order: i, group: i, after: true };
    if (q.r >= 22) {
      const c = K.AL(pl, "label · " + q.it.label.toLowerCase(), "VERTICAL", { cross: "CENTER" });
      K.caps(c, q.it.label, "strong").motion = mo;
      K.caps(c, (up ? "+" : "−") + Math.abs(q.it.chg).toFixed(1) + "%", up ? "status/success" : "status/danger").motion = mo;
      layout(c);
      c.x = Math.round(q.x - c.w / 2); c.y = Math.round(q.y - c.h / 2);
    } else if (q.r >= 17) {
      const t = K.caps(pl, q.it.label, "body");
      t.x = Math.round(q.x - Math.ceil(t.w) / 2); t.y = q.y - 7;
      t.motion = mo;
    }
  });
  return pl;
}
