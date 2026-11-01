// C.milestones (Figma ember-chart-4.js): steps on a track, each a ring filled to its reach (from 12 o'clock) with its
// number inside, links between steps as thick as the next step's reach, the day above, the name, the % and REACHED
// below. Narrow: names that overflow their column get twice the room and alternate down 16 px.
import { arc, cell, ctr, overflows, place, X, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type MilestonesData = { steps: { label: string; pct: number; day: string }[] };

export function milestones(K: Kit, p: Frame, w: number, o: MilestonesData): Frame {
  const pl = K.plot(p, "milestones", w, K.PH);
  const n = o.steps.length, x0 = Math.max(36, Math.floor(w / (2 * n))), x1 = w - x0, cy = 62;
  const xs = (i: number) => X(i, n, x0, x1), cw = Math.floor((x1 - x0) / (n - 1)) - 4;
  for (let i = 0; i < n - 1; i++) {
    const h = 2 + 2 * Math.round((o.steps[i + 1].pct / 100) * 3);
    const r = K.rect(pl, "link " + (i + 1), xs(i) + 16, cy - h / 2, xs(i + 1) - xs(i) - 32, h, "data/primary", 1);
    r.opacity = 0.35 + (0.65 * o.steps[i + 1].pct) / 100;
    r.motion = { kind: "grow", origin: "left", order: i + 1, group: i + 1 };
  }
  const nar = overflows(o.steps.map((x) => x.label), cw, "Body/S");
  for (let i = 0; i < n; i++) {
    const s = o.steps[i];
    const cx = xs(i);
    arc(K, pl, "track", cx, cy, 14, 0.78, 0, 2 * Math.PI, "data/track");
    // rings sweep from 12 o'clock: no sweep kind yet, so the reached arc fades in step order
    arc(K, pl, "reached", cx, cy, 14, 0.78, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * s.pct) / 100, "data/primary").motion = { kind: "sweep", order: i, group: i };
    const c = ctr(K, pl, "step", [["Label/Caps", String(i + 1), "strong"]]);
    place(c, cx - c.w / 2, cy - c.h / 2);
    // stays centred on its step and inside the plot
    const lw = nar ? Math.min(2 * cw, 2 * cx, 2 * (w - cx)) : cw, dy = nar && i % 2 ? 16 : 0;
    cell(K, pl, s.day, cx - cw / 2, cy - 38, cw, "Label/Caps", "label");
    cell(K, pl, s.label, cx - lw / 2, cy + 24 + dy, lw, "Body/S", "strong");
    cell(K, pl, s.pct + "%", cx - cw / 2, cy + (nar ? 76 : 62), cw, cw < 56 ? "Body/S" : "Body/L", "strong").motion = { kind: "fade", order: i, group: i, after: true };
    if (cw >= 64) cell(K, pl, "REACHED", cx - cw / 2, cy + 90, cw, "Label/Caps", "label");
  }
  return pl;
}
