// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 061 Event barcode (Figma chart/061, "Request outcomes"): C.barcode, sampled requests per service over 24 h.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { barcode } from "../../plots/barcode";
import { data } from "./data";

const pct = (v: number) => +(v * 100).toFixed(1) + "%";

const r4 = (v: number) => Math.round(v * 10000) / 10000;

/** Outcome counts per lane, drawn exactly as the plot draws them (same seeded sequence, lane after lane). */
const outcomes = (o: typeof data): { ok: number; slow: number; err: number }[] => {
  let s = o.seed ?? 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const wm = Math.max(...o.weights);
  return o.rows.map((row) => {
    const c = { ok: 0, slow: 0, err: 0 };
    let made = 0, guard = 0;
    while (made < row.n && guard++ < row.n * 20) {
      const t = rnd();
      if (rnd() > o.weights[Math.min(23, Math.floor(t * 24))] / wm) continue;
      const q = rnd();
      if (q < row.err) c.err++; else if (q < row.err + row.slow) c.slow++; else c.ok++;
      made++;
    }
    return c;
  });
};

// tooltip: one service lane (group = lane): its sampled requests by outcome over the 24 h
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g], c = outcomes(o)[g];
  if (!r || !c) return null;
  const n = c.ok + c.slow + c.err;
  return {
    kind: "series",
    caps: r.label.toUpperCase() + " · LAST 24 H",
    rows: [
      { label: "OK", value: String(c.ok), swatch: "text/action" },
      { label: "Slow", value: String(c.slow), swatch: "status/warning" },
      { label: "Error", value: String(c.err), swatch: "status/danger" },
    ],
    total: { label: "Requests", value: String(n) },
  };
};

export const def: ChartDef = {
  no: 61,
  slug: "event-barcode",
  legend: [["text/action", "OK"], ["status/warning", "Slow"], ["status/danger", "Error"]],
  plot: (K, p, w, d) => barcode(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next 24 h: a new sample of the same number of requests per service, error and slow rates move up to ±25 %
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, seed: (o.seed ?? 7) + step * 97, rows: o.rows.map((r, k) => ({ ...r, err: r4(r.err * (1 + 0.25 * Math.sin(k * 1.9 + step * 2.2))), slow: r4(r.slow * (1 + 0.2 * Math.sin(k * 1.1 + step * 1.6))) })) };
  },
  describe: {
    title: "Request outcomes",
    summary: `${data.rows.reduce((a, r) => a + r.n, 0)} sampled requests over the last 24 hours on ${data.rows.length} services; Agents has the highest error rate at ${pct(data.rows[2].err)}.`,
    table: { head: ["Service", "Sampled requests", "Error rate", "Slow rate"], rows: data.rows.map((r) => [r.label, r.n, pct(r.err), pct(r.slow)]) },
  },
};
