// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 099 Pass/fail grid (Figma chart/099): C.passGrid on the v4.2 release eval gate.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { passGrid } from "../../plots/pass-grid";
import { data } from "./data";

const RES = { p: "Pass", f: "Fail", x: "Flaky" } as const;
const count = (v: "p" | "f" | "x") => data.m.flat().filter((c) => c === v).length;
const suite = (s: string) => (s.length <= 3 ? s : s.charAt(0) + s.slice(1).toLowerCase());

/** The next nightly re-runs of the gate: failures stand, flaky results settle to pass (one after another), and a few
 *  passes turn flaky (seeded on model, suite and run). Pass and flaky each draw one glyph, so the cell count and the
 *  glyph count stay; the changed cells' tint morphs and their glyph fades (a check and a dash differ in path commands). */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const flake = (i: number, j: number) => { const h = Math.sin(i * 12.9898 + j * 78.233 + step * 37.719) * 43758.5453; return h - Math.floor(h) < 0.07; };
  return { ...d, m: d.m.map((r, i) => r.map((v, j) => (v === "f" ? v : v === "x" ? (step >= 1 + ((i + j) % 3) ? "p" : "x") : flake(i, j) ? "x" : "p"))) };
}

/** Hover: one cell (its tint and glyph): model × suite result, and how the model did on the gate. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, n = d.suites.length, i = Math.floor(g / n), j = g % n, v = d.m[i]?.[j];
  if (!v) return null;
  const same = d.m[i].filter((x) => x === v).length;
  return {
    kind: "cell", caps: `${d.models[i]} · ${suite(d.suites[j])}`.toUpperCase(), value: RES[v],
    swatch: v === "p" ? "status/success" : v === "f" ? "status/danger" : "status/warning",
    share: `${same} OF ${n} SUITES ${RES[v].toUpperCase()}`,
  };
}

export const def: ChartDef = {
  no: 99,
  slug: "pass-fail-grid",
  legend: [["status/success", "Pass"], ["status/warning", "Flaky"], ["status/danger", "Fail"]],
  plot: (K, p, w, d) => passGrid(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Release eval gate v4.2",
    summary: `${data.models.length} models on ${data.suites.length} eval suites: ${count("p")} passes, ${count("f")} failures and ${count("x")} flaky results.`,
    table: { head: ["Model", ...data.suites.map(suite)], rows: data.models.map((m, i) => [m, ...data.m[i].map((v) => RES[v])]) },
  },
};
