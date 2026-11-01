// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 070 Uptime bars (Figma chart/070, "Service uptime"): C.uptime, 63 days of 3 services.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { uptime } from "../../plots/uptime";
import { data } from "./data";

const count = (d: string[], s: string) => d.filter((x) => x === s).length;
const down = data.rows.find((r) => r.days.includes("down"))!;
const ago = down.days.length - 1 - down.days.indexOf("down");

// uptime from the day states: 99.99 % less 0.01 per degraded day and 0.06 per outage day (the sample's own numbers)
const uptimeText = (d: string[]) => (99.99 - 0.01 * count(d, "slow") - 0.06 * count(d, "down")).toFixed(2) + "%";

// tooltip: one service's row of days (group = service): days by state, the days shown as the total
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g];
  if (!r) return null;
  return {
    kind: "series",
    caps: r.label.toUpperCase() + " · " + r.text + " UPTIME",
    rows: [["ok", "Operational"], ["slow", "Degraded"], ["down", "Outage"]].map(([s, label]) => ({ label, value: count(r.days, s) + (count(r.days, s) === 1 ? " day" : " days"), swatch: o.toks[s] })),
    total: { label: "Days shown", value: r.days.length + " days" },
  };
};

export const def: ChartDef = {
  no: 70,
  slug: "uptime-bars",
  legend: [["status/success", "Operational"], ["status/warning", "Degraded"], ["status/danger", "Outage"]],
  // live: a new day arrives on the right, the oldest leaves
  tick: (d, step) => {
    const o = d as typeof data;
    return { ...o, rows: o.rows.map((r, i) => ({ ...r, days: [...r.days.slice(1), (step + i) % 9 === 4 ? "slow" : "ok"] })) };
  },
  plot: (K, p, w, d) => uptime(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // a week later per step: seven new days arrive on the right (a degraded day on some), the oldest leave; the
  // uptime figures are recomputed from the days shown
  update: (d, step) => {
    const o = d as typeof data, n = 7 * step;
    return {
      ...o,
      rows: o.rows.map((r, k) => {
        const days = [...r.days.slice(n), ...Array.from({ length: n }, (_, i) => ((i * 5 + k * 3) % 11 === 4 ? "slow" : "ok"))];
        return { ...r, days, text: uptimeText(days) };
      }),
    };
  },
  describe: {
    title: "Status",
    summary: `Daily state of ${data.rows.length} services over the last 63 days: API 99.98%, Dashboard 99.99%, Webhooks 99.91% uptime; one outage day, on ${down.label} ${ago} days ago.`,
    table: { head: ["Service", "Uptime", "Operational days", "Degraded days", "Outage days"], rows: data.rows.map((r) => [r.label, r.text, count(r.days, "ok"), count(r.days, "slow"), count(r.days, "down")]) },
  },
};
