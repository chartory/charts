// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.journey (Figma ember-chart-5.js, type 96): a shipment timeline. Phase bars up to now, a dashed ETA line after it,
// events as dots on stems (filled when passed, ringed when ahead) with a name and date above or below; labels that
// collide in a row are dropped (the row's last event wins), a NOW pill, date ticks under the axis.
import { box, dash, outline, pill, place, type Kit } from "../core/kit";
import { remove, type Frame, type Text } from "../core/node";

export type JourneyData = {
  t0: number; t1: number; now: number;
  phases: [number, number, string][];
  events: { t: number; label: string; date: string; up: boolean }[];
  xl: [number, string][];
};

export function journey(K: Kit, p: Frame, w: number, o: JourneyData): Frame {
  const pl = K.plot(p, "journey", w, K.PH);
  const x = (t: number) => 4 + Math.round(((t - o.t0) / (o.t1 - o.t0)) * (w - 8)), yb = 96;
  o.phases.forEach(([a, b, tok], i) => { box(K, pl, "phase", x(a), yb - 3, x(b) - x(a) - 2, 6, tok, 3).motion = { kind: "reveal", order: i }; });
  dash(K, pl, "eta", "M " + x(o.now) + " " + yb + " L " + x(o.t1) + " " + yb, "body", 2).motion = { kind: "draw", order: o.phases.length };
  type Lab = { lb: Text; dt: Text; x0: number; x1: number };
  const rowsL: Record<string, Lab[]> = {};
  o.events.forEach((e, i) => {
    const ex = x(e.t);
    const stem = e.up ? K.rect(pl, "stem", ex, yb - 22, 1, 22, "body") : K.rect(pl, "stem", ex, yb, 1, 14, "body");
    stem.motion = { kind: "grow", origin: e.up ? "bottom" : "top", order: i, group: i };
    const d = K.dot(pl, 10, e.t <= o.now ? "data/primary" : K.BG, "event · " + e.label.toLowerCase());
    d.x = ex - 5; d.y = yb - 5;
    if (e.t > o.now) outline(d, "body", 1.5);
    d.motion = { kind: "pop", order: i, group: i };
    const lb = K.T(pl, "Body/S", e.label, "strong");
    const dt = K.caps(pl, e.date, "label");
    lb.motion = { kind: "fade", order: i, group: i, after: true }; dt.motion = { ...lb.motion };
    const bw = Math.max(Math.ceil(lb.w), Math.ceil(dt.w));
    const lx = Math.max(0, Math.min(w - bw, ex + 6));
    if (e.up) { place(lb, lx, yb - 58); place(dt, lx, yb - 40); } else { place(lb, lx, yb + 8); place(dt, lx, yb + 26); }
    (rowsL[e.up ? "up" : "down"] ??= []).push({ lb, dt, x0: lx, x1: lx + bw });
  });
  // labels that collide in the same row: the later one wins only if it is the row's last event, otherwise it is dropped
  for (const r of Object.values(rowsL)) {
    const kept: Lab[] = [];
    r.forEach((q, i) => {
      const prev = kept[kept.length - 1];
      if (prev && q.x0 < prev.x1 + 8) {
        if (i === r.length - 1) { remove(prev.lb); remove(prev.dt); kept.pop(); kept.push(q); } else { remove(q.lb); remove(q.dt); }
      } else kept.push(q);
    });
  }
  const nw = pill(K, pl, "NOW", "info");
  place(nw, x(o.now) - Math.round(nw.w / 2), yb - 30);
  for (const [t, s] of o.xl) K.xAt(pl, s, x(t), K.PH - 14, t === o.t0 ? "start" : t === o.t1 ? "end" : "center");
  return pl;
}
