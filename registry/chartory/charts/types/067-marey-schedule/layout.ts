// 067 Marey schedule (Figma chart/067, "Van schedule"): C.marey, 4 vans on the route, Van 19 against its plan.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { marey } from "../../plots/marey";
import { data } from "./data";

const hm = (m: number) => String(8 + Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
const name = (s: string) => s[0] + s.slice(1).toLowerCase();
const late = data.vans.find((v) => v.late)!;
const behind = late.times[late.times.length - 1][0] - data.plan![data.plan!.length - 1][0];

// tooltip: one van's line (group = van): leaves the first stop, its longest stop, reaches the last stop (and the
// plan for the late van)
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const v = o.vans[g];
  if (!v || !v.times.length) return null;
  const n = v.times.length, sw = v.tok;
  let k = 0;
  v.times.forEach(([a, b], i) => { if (b - a > v.times[k][1] - v.times[k][0]) k = i; });
  const rows = [
    { label: "Leaves " + name(o.stops[0]), value: hm(v.times[0][1]), swatch: sw },
    { label: "Longest stop · " + name(o.stops[k]), value: v.times[k][1] - v.times[k][0] + " min", swatch: sw },
    { label: "Reaches " + name(o.stops[n - 1]), value: hm(v.times[n - 1][0]), swatch: sw },
  ];
  const pl = o.plan?.[o.plan.length - 1];
  if (v.late && pl) rows.push({ label: "Plan", value: hm(pl[0]), swatch: "text/action" });
  return { kind: "range", caps: v.label.toUpperCase() + (v.late ? " · LATE" : ""), rows };
};

export const def: ChartDef = {
  no: 67,
  slug: "marey-schedule",
  legend: [["data/cat-2", "Van 11"], ["data/cat-3", "Van 12"], ["data/cat-4", "Van 17"], ["status/danger", "Van 19 · late"], ["text/action", "Plan"]],
  plot: (K, p, w, d) => marey(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next run: every van leaves a few minutes earlier or later; Van 19 shortens its stop at the third stop and
  // catches up (times stay on the axis, each van's last stop keeps arrive = depart)
  update: (d, step) => {
    const o = d as typeof data;
    const at = (t: number) => Math.min(o.t1, Math.max(o.t0, t));
    return {
      ...o,
      vans: o.vans.map((v, j) => {
        const sh = Math.round(6 * Math.sin(j * 1.7 + step * 2.1)), gain = v.late ? [8, 14, 20][(step - 1) % 3] : 0;
        return { ...v, times: v.times.map(([a, b], i) => [at(a + sh - (i > 2 ? gain : 0)), at(b + sh - (i >= 2 ? gain : 0))] as [number, number]) };
      }),
    };
  },
  describe: {
    title: "Line schedule",
    summary: `${data.vans.length} vans on a ${data.stops.length}-stop route from ${hm(data.t0)} to ${hm(data.t1)}; ${late.label} reaches ${name(data.stops[data.stops.length - 1])} at ${hm(late.times[late.times.length - 1][0])}, ${behind} minutes after its plan, after a 42-minute stop at ${name(data.stops[2])}.`,
    table: {
      head: ["Van", ...data.stops.map(name)],
      rows: [...data.vans.map((v) => [v.label, ...v.times.map(([a, d]) => (a === d ? hm(a) : hm(a) + "–" + hm(d)))]), ["Van 19 plan", ...data.plan!.map(([a, d]) => (a === d ? hm(a) : hm(a) + "–" + hm(d)))]],
    },
  },
};
