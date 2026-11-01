// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 057 Route line (Figma chart/057, "Route progress"): C.metro, 12 stops on two rows, the van at Elm Park.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { metro } from "../../plots/metro";
import { data } from "./data";

const done = data.stops.filter((s) => s.state === "done").length;
const state = { done: "Delivered", now: "Current stop", next: "Planned" };

const later = (t: string, m: number) => { const [h, mm] = t.split(":").map(Number), v = h * 60 + mm + m; return String(Math.floor(v / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0"); };

// tooltip: one stop (group = stop index): name, time and status
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const s = o.stops[g];
  if (!s) return null;
  return { kind: "value", text: s.state === "now" ? s.name + " · Now" : s.name + " · " + s.eta + " · " + state[s.state] };
};

export const def: ChartDef = {
  no: 57,
  slug: "route-line",
  legend: [["data/primary", "Delivered"], ["data/track", "Planned"]],
  plot: (K, p, w, d) => metro(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // a later reading of the same run: the planned stops' times slip by a few minutes (traffic), delivered ones stay
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, stops: o.stops.map((s, i) => (s.state === "next" ? { ...s, eta: later(s.eta, Math.max(1, Math.round(4 + 3 * Math.sin(i * 1.3 + step * 2.1) + step))) } : s)) };
  },
  describe: {
    title: "Route progress",
    summary: `A delivery route of ${data.stops.length} stops from the depot at 07:30 back to the depot at 11:40: ${done} stops delivered, now at Elm Park, ${data.stops.filter((s) => s.state === "next").length} still planned.`,
    table: { head: ["Stop", "Time", "Status"], rows: data.stops.map((s) => [s.name, s.eta === "NOW" ? "Now" : s.eta, state[s.state]]) },
  },
};
