// C.cycleRing (Figma ember-chart-5.js, type 98): the cash conversion cycle as two rings from 12 o'clock. Outer ring:
// inventory days then receivable days (a small gap between); inner ring: payable days. A ringed dot where cash comes
// back, a centred value + caption, and the side list (C.sideList).
import { arc, ctr, P, paint, place, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type CycleRingData = { dio: number; dso: number; dpo: number; max: number; center: [StyleName, string, string][]; rows: Row[] };

export function cycleRing(K: Kit, p: Frame, w: number, o: CycleRingData): Frame {
  const pl = K.plot(p, "cash cycle", w, K.PH);
  const R = Math.min(Math.floor((K.PH - 12) / 2), Math.floor((w - 36 - 88) / 2)) /* the side list keeps 88 px */, cx = 8 + R, cy = Math.floor(K.PH / 2);
  const a = (d: number) => -Math.PI / 2 + (d / o.max) * 2 * Math.PI;
  // arcs sweep from 12 o'clock: no sweep kind yet, so they fade in order around the ring
  arc(K, pl, "outer track", cx, cy, R, 0.84, 0, 2 * Math.PI, "data/track");
  arc(K, pl, "inventory days", cx, cy, R, 0.84, a(0), a(o.dio) - 0.02, "data/cat-2").motion = { kind: "sweep", order: 0, group: 0 };
  arc(K, pl, "receivable days", cx, cy, R, 0.84, a(o.dio) + 0.02, a(o.dio + o.dso), "data/cat-3").motion = { kind: "sweep", order: 1, group: 1 };
  const r2 = R - 22;
  arc(K, pl, "inner track", cx, cy, r2, 0.8, 0, 2 * Math.PI, "data/track", 0.6);
  arc(K, pl, "payable days", cx, cy, r2, 0.8, a(0), a(o.dpo), "data/primary").motion = { kind: "sweep", order: 0, group: 2 };
  const [gx, gy] = P(cx, cy, Math.round((R * (1 + 0.84)) / 2), a(o.dio + o.dso));
  const d = K.dot(pl, 10, "strong", "cash returns");
  d.x = Math.round(gx - 5); d.y = Math.round(gy - 5);
  d.stroke = paint(K.BG); d.sw = 2; d.align = "outside";
  d.motion = { kind: "pop", order: 2, group: 1, after: true };
  const c = ctr(K, pl, "centre", o.center, 0);
  place(c, cx - c.w / 2, cy - c.h / 2);
  for (const t of c.children) t.motion = { kind: "fade", order: 3, after: true };
  K.sideList(pl, cx + R + 28, w - (cx + R + 28), o.rows);
  return pl;
}
