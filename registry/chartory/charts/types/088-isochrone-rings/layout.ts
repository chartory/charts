// 088 Isochrone rings (Figma chart/088-isochrone-depot): C.isochrone, today's stops round Depot North.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { isochrone } from "../../plots/isochrone";
import { data } from "./data";

const zone = (m: number) => data.rings.find((r) => m <= r)!;
const late = data.pts.filter((p) => p[2]).length;

/** Tomorrow's stops: same stops and lateness, drive times move by up to 3 min; the side list counts again. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const pts = d.pts.map(([a, m, late], k): [number, number, boolean] => [a, +Math.min(59, Math.max(5, m + 3 * Math.sin(k * 2.1 + step * 1.7 + 0.4))).toFixed(1), late]);
  const under = Math.round((100 * pts.filter((p) => p[1] < 30).length) / pts.length);
  return { ...d, pts, rows: [{ ...d.rows[0], text: under + "%" }, { ...d.rows[1], text: 100 - under + "%" }, { ...d.rows[2], text: String(pts.filter((p) => p[2]).length) }] };
}

/** Hover: one stop (its dot): drive time, ring and lateness. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, q = d.pts[g];
  if (!q) return null;
  const k = Math.max(0, d.rings.findIndex((x) => q[1] <= x)), lo = k ? d.rings[k - 1] : 0;
  return { kind: "value", text: `Stop ${g + 1} · ${q[1]} min · ${lo}–${d.rings[k]} min ring · ${q[2] ? "late" : "on time"}` };
}

export const def: ChartDef = {
  no: 88,
  slug: "isochrone-rings",
  legend: [["status/success", "On time"], ["status/danger", "Late"], ["text/strong", "Depot · rings 15 min"]],
  plot: (K, p, w, d) => isochrone(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Drive time zones",
    summary: `${data.pts.length} stops by drive time from the depot in 15-minute rings: ${data.pts.filter((p) => p[1] < 30).length} under 30 minutes, ${late} late.`,
    table: { head: ["Ring (min)", "Stops", "Late"], rows: data.rings.map((r) => [r, data.pts.filter((p) => zone(p[1]) === r).length, data.pts.filter((p) => zone(p[1]) === r && p[2]).length]) },
  },
};
