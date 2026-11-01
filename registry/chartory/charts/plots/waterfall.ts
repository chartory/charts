// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.waterfall (Figma ember-chart-3.js): running total from an opening to a closing balance; totals in data/primary
// from zero, steps green up / red down, dashed connectors at the running level, signed values above the steps
// (dropped when wider than the step's band).
import { dash, type Kit } from "../core/kit";
import { collection, type Frame, remove, type Text } from "../core/node";
import { signalPlot } from "../core/signal-hook";

/** True when two neighbouring x labels on one row are less than 4 px apart (waterfall: then stagger, never drop). */
export const touching = (labs: Text[]): boolean => labs.some((t, i) => i > 0 && t.y === labs[i - 1].y && t.x < labs[i - 1].x + Math.ceil(labs[i - 1].w) + 4);

export type WaterfallStep = { label: string; v: number; total?: boolean };
export type WaterfallData = {
  max: number; ticks: string[]; fmt: (v: number) => string; steps: WaterfallStep[];
  /** step names wider than their column: every other one on a second row (the plot's base rises one row). "auto"
   *  (site cards with long names): one row, or two when two names would touch, so no x label is ever dropped. */
  stagger?: boolean | "auto";
};

export function waterfall(K: Kit, p: Frame, w: number, o: WaterfallData): Frame {
  if (collection.signal) return signalPlot("waterfall")(K, p, w, o); // Signal: charts/signal/plots/waterfall.ts (@chartory/signal)
  const pl = K.plot(p, "waterfall", w, K.PH);
  const yW = 40, base = K.BASE;
  if (o.stagger === true) K.BASE -= 14;
  K.yGrid(pl, o.ticks, yW, w);
  const bs = K.bands(yW + 8, w - yW - 8, o.steps.length, 0.5);
  let run = 0, prevTop: number | null = null;
  const labs: Text[] = [];
  for (let i = 0; i < o.steps.length; i++) {
    const s = o.steps[i], b = bs[i];
    const from = s.total ? 0 : run, to = s.total ? s.v : run + s.v;
    run = s.total ? s.v : to;
    const y0 = K.yMap(Math.max(from, to), 0, o.max), y1 = K.yMap(Math.min(from, to), 0, o.max);
    const t = s.total ? "data/primary" : s.v >= 0 ? "status/success" : "status/danger";
    // flows open in reading order: up steps grow from their foot, down steps from their top
    const step = K.rect(pl, "step · " + s.label.toLowerCase(), b.x, y0, b.w, Math.max(2, y1 - y0), t, 3);
    step.motion = { kind: "grow", origin: s.total || s.v >= 0 ? "bottom" : "top", order: i, group: i };
    if (prevTop != null) dash(K, pl, "connector " + i, "M " + (bs[i - 1].x + bs[i - 1].w) + " " + prevTop + " L " + b.x + " " + prevTop, "grid").motion = { kind: "fade", order: i };
    prevTop = K.yMap(run, 0, o.max);
    if (!s.total) {
      const v = K.caps(pl, (s.v > 0 ? "+" : "−") + o.fmt(Math.abs(s.v)), s.v >= 0 ? "status/success" : "status/danger");
      v.name = "value · " + s.label.toLowerCase();
      v.motion = { kind: "fade", order: i, group: i, after: true };
      const tw = Math.ceil(v.w);
      if (tw > b.w + b.g - 4) remove(v);
      else { v.x = b.x + Math.round((b.w - tw) / 2); v.y = y0 - 16; }
    }
    labs.push(K.xAt(pl, s.label, b.x + Math.round(b.w / 2), K.PH - (o.stagger === true && i % 2 === 0 ? 28 : 14), "center"));
  }
  K.BASE = base;
  // names that touch on one row: draw again with every other name on a second row
  if (o.stagger === "auto" && touching(labs)) { remove(pl); return waterfall(K, p, w, { ...o, stagger: true }); }
  return pl;
}
