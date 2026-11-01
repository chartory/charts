// 052 Radial hour heatmap (Figma chart/052, "Deliveries by hour"): C.radialHeat, 7 day rings (Monday inside) × 24 hours.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { radialHeat } from "../../plots/radial-heat";
import { data } from "./data";
import { seq } from "../../core/kit";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hh = (h: number) => String(h).padStart(2, "0") + ":00";

const r2 = (v: number) => Math.round(v * 100) / 100;
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

// tooltip: one day × hour cell (group = day * 24 + hour); share = the slot's part of the week's volume
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const d = Math.floor(g / 24), h = g % 24, v = o.vals[d]?.[h];
  if (v == null) return null;
  const all = sum(o.vals.map(sum));
  return { kind: "cell", caps: days[d].toUpperCase() + " · " + hh(h), value: Math.round(v * 100) + "%", unit: "of peak", swatch: seq(v), share: (all ? (v / all) * 100 : 0).toFixed(1) + "% OF WEEK" };
};

export const def: ChartDef = {
  no: 52,
  slug: "radial-hour-heatmap",
  legend: [["data/seq-2", "Low"], ["data/seq-4", "Medium"], ["data/seq-6", "Peak"]],
  flatXs: true,
  plot: (K, p, w, d) => radialHeat(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // a later 4 weeks: every slot moves up to ±10 %, the weekend as a whole by −10 … +14 %; the peak slot stays the
  // busiest, the side list's peak and weekend share are recomputed from the new values
  update: (d, step) => {
    const o = d as typeof data;
    const [pd, ph] = (() => { let b = [0, 0]; o.vals.forEach((r, di) => r.forEach((v, h) => { if (v > o.vals[b[0]][b[1]]) b = [di, h]; })); return b; })();
    const wk = [0.9, 1.08, 1.14][(step - 1) % 3];
    const vals = o.vals.map((r, di) => r.map((v, h) => (di === pd && h === ph ? v : Math.min(o.vals[pd][ph] - 0.02, r2(v * (1 + 0.1 * Math.sin(h * 0.7 + di * 1.3 + step * 2.1)) * (di >= 5 ? wk : 1))))));
    const share = (vs: number[][]) => sum(vs.slice(5).map(sum)) / sum(vs.map(sum));
    const old = o.rows.find((r) => r.label === "Weekend")!;
    const pct = Math.round((parseFloat(old.text) * share(vals)) / share(o.vals)) + "%";
    return { ...o, vals, rows: o.rows.map((r) => (r.label === "Peak slot" ? { ...r, text: days[pd] + " " + hh(ph) } : r.label === "Weekend" ? { ...r, text: pct } : r)) };
  },
  describe: {
    title: "Delivery rhythm",
    summary: "Deliveries over the last 4 weeks by weekday and hour, as a share of the busiest slot: the peak is Thursday 18:00, the quietest slot Sunday 03:00, and the weekend carries 14% of the volume.",
    table: { head: ["Day", ...Array.from({ length: 24 }, (_, h) => hh(h))], rows: data.vals.map((r, d) => [days[d], ...r.map((v) => Math.round(v * 100) + "%")]) },
  },
};
