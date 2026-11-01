// C.loadPlan (Figma ember-chart-4.js): one trailer per truck (outline, cab), pallets in columns scaled to the
// trailer (one tall pallet or two stacked), the truck's caps label above and its load factor on the right (amber
// under 85 %).
import { outline, place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type LoadPlanData = { trucks: { label: string; pct: number; cols: [number, string[]][] }[] };

export function loadPlan(K: Kit, p: Frame, w: number, o: LoadPlanData): Frame {
  const pl = K.plot(p, "load plan", w, K.PH);
  const tw = w - 84, rh = 52;
  let order = 0;
  for (let i = 0; i < o.trucks.length; i++) {
    const t = o.trucks[i];
    const y = i * rh;
    const lb = K.caps(pl, t.label, "body");
    place(lb, 0, y);
    const ty = y + 16;
    outline(K.rect(pl, "trailer · " + t.label.toLowerCase(), 0, ty, tw, 34, null, 4), "chipStroke");
    outline(K.rect(pl, "cab", tw + 4, ty + 6, 28, 28, "chipFill", 6), "chipStroke");
    const sum = t.cols.reduce((a, c) => a + c[0] + 2, 0), kx = Math.min(1, (tw - 6) / sum);
    let x = 3;
    for (const [bw0, stack] of t.cols) {
      const bw = Math.max(6, Math.floor(bw0 * kx));
      // pallets load front to back, truck by truck
      const k = order++;
      stack.forEach((tok, j) => {
        const b = K.rect(pl, "pallet", x, ty + 2 + j * 15, bw, stack.length === 1 ? 30 : 14, tok, 2);
        b.opacity = 0.9;
        b.motion = { kind: "fade", order: k, group: i };
      });
      x += bw + 2;
    }
    const pc = K.T(pl, "Body/S", t.pct + "%", t.pct >= 85 ? "strong" : "status/warning");
    place(pc, w - Math.ceil(pc.w), ty + 17 - pc.h / 2);
    pc.motion = { kind: "fade", order: order, group: i, after: true };
  }
  return pl;
}
