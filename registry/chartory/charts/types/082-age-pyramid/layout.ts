// 082 Age pyramid (Figma chart/082-pyramid-customers): C.pyramid, new customers left, returning right.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { pyramid } from "../../plots/pyramid";
import { data } from "./data";

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** Shares that still sum to 100 (largest remainder), each at most the axis max. */
function reshare(vals: number[], f: (i: number) => number, max: number): number[] {
  const tot = vals.reduce((a, b) => a + b, 0), raw = vals.map((v, i) => v * f(i)), s = raw.reduce((a, b) => a + b, 0);
  const ex = raw.map((v) => Math.min(max, (v / s) * tot)), out = ex.map(Math.floor);
  const order = ex.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (let r = tot - out.reduce((a, b) => a + b, 0), j = 0; r > 0; j++) { const i = order[j % order.length][1]; if (out[i] < max) { out[i]++; r--; } }
  return out;
}
/** A later quarter: the age mix of new and returning customers shifts; each side still sums to 100 %. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const a = reshare(d.rows.map((r) => r.a), (i) => 1 + 0.14 * wob(i, step), d.max);
  const b = reshare(d.rows.map((r) => r.b), (i) => 1 + 0.14 * wob(i + 7, step), d.max);
  return { ...d, rows: d.rows.map((r, i) => ({ ...r, a: a[i], b: b[i] })) };
}

/** Hover: one age band (both bars and their %): the share of new and of returning customers in it. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, r = d.rows[g];
  return r ? { kind: "series", caps: "AGE " + r.label, rows: [{ label: "New", value: r.a + "%", swatch: d.aTok }, { label: "Returning", value: r.b + "%", swatch: d.bTok }] } : null;
}

export const def: ChartDef = {
  no: 82,
  slug: "age-pyramid",
  legend: [["data/cat-2", "New"], ["data/primary", "Returning"]],
  plot: (K, p, w, d) => pyramid(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Customers by age",
    summary: `Share of new and returning customers by age band: 25–34 is the largest new band (${data.rows[1].a}%), 35–44 the largest returning band (${data.rows[2].b}%).`,
    table: { head: ["Age", "New (%)", "Returning (%)"], rows: data.rows.map((r) => [r.label, r.a, r.b]) },
  },
};
