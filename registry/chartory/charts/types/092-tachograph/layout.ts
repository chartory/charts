// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 092 Tachograph (Figma chart/092): C.tacho on today's driver cards, with the drive-time list beside the disc.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { tacho } from "../../plots/tacho";
import { data } from "./data";

const KIND: Record<string, string> = { drive: "Driving", work: "Other work", rest: "Rest", avail: "Available" };
const clock = (h: number) => String(Math.floor(h)).padStart(2, "0") + ":" + String(Math.round((h % 1) * 60)).padStart(2, "0");

/** Another day: each activity boundary moves by up to a quarter hour; drive time and its warning (over 8 h) recomputed. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  // phase 3.6 keeps T. Brandt's value as wide as the sample's (no 7.x h): at S a narrower one brings back the DRIVE caps
  let k = 0;
  const drivers = d.drivers.map((dr) => {
    let prev = -Infinity;
    const b = [dr.segs[0][0], ...dr.segs.map((s) => s[1])].map((t) => {
      const v = Math.max(prev + 0.25, t + 0.25 * Math.round(Math.sin(k++ * 2.1 + step * 1.7 + 3.6) * 1.4));
      prev = v;
      return v;
    });
    return { ...dr, segs: dr.segs.map((s, i): [number, number, string] => [b[i], b[i + 1], s[2]]) };
  });
  const rows = d.rows.map((r, i) => {
    const h = drivers[i].segs.filter((s) => s[2] === "drive").reduce((a, s) => a + s[1] - s[0], 0);
    const { tone, ...rest } = r;
    void tone;
    return h > 8 ? { ...rest, text: h.toFixed(1) + " h", tone: "status/warning" } : { ...rest, text: h.toFixed(1) + " h" };
  });
  return { ...d, drivers, rows };
}

/** Hover: one driver (their ring of activities): hours per activity, the shift total. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, dr = d.drivers[g];
  if (!dr) return null;
  const hrs = (k: string) => dr.segs.filter((s) => s[2] === k).reduce((a, s) => a + s[1] - s[0], 0);
  const rows = Object.keys(KIND).filter((k) => hrs(k) > 0).map((k) => ({ label: KIND[k], value: hrs(k).toFixed(1) + " h", swatch: d.kinds[k] }));
  const a = dr.segs[0][0], b = dr.segs[dr.segs.length - 1][1];
  return { kind: "series", caps: `${dr.label} · ${clock(a)}–${clock(b)}`.toUpperCase(), rows, total: { label: "Shift", value: (b - a).toFixed(1) + " h" } };
}

export const def: ChartDef = {
  no: 92,
  slug: "tachograph",
  legend: [["data/primary", "Driving"], ["status/warning", "Other work"], ["status/success", "Rest"], ["data/cat-2", "Available"]],
  // radius-bound like the other round types: Figma's XS legend=off keeps the legend-on plot height (150), centred
  flatXs: true,
  plot: (K, p, w, d) => tacho(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Driver hours today",
    summary: `Activity of ${data.drivers.length} drivers over 24 hours: driving time ${data.rows.map((r) => `${r.label} ${r.text}`).join(", ")}.`,
    table: {
      head: ["Driver", "From", "To", "Activity"],
      rows: data.drivers.flatMap((d) => d.segs.map(([a, b, k]) => [d.label, clock(a), clock(b), KIND[k]])),
    },
  },
};
