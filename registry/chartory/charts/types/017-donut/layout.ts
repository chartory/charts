// 017 Donut (Figma chart/017, "MRR by plan"): C.pie (a full pie, no hole) with the plan list beside it.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { pie } from "../../plots/pie";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
/** Whole-percent shares that sum to 100 (largest remainder). */
const shares = (vs: number[]): number[] => {
  const t = vs.reduce((a, b) => a + b, 0), raw = vs.map((v) => (v / t) * 100), out = raw.map(Math.floor);
  const left = 100 - out.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => out[i]++);
  return out;
};
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

/** Hover tooltip: one plan's slice (its MRR and share, as in the list). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const r = (d as typeof data).rows[g];
  return { kind: "value", text: `${r.label} · ${r.text} · ${r.pct}` };
};

export const def: ChartDef = {
  no: 17,
  slug: "donut",
  legend: null,
  flatXs: true,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = pie(K, p, w, o);
    return o === data ? pl : keepNames(pl, pie(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later months: MRR per plan moves ±10 % (whole $K); values and shares are recomputed, shares sum to 100
    const vs = o.slices.map((s, i) => Math.max(1, Math.round(s.v * (1 + 0.1 * wave(i, step)))));
    const pc = shares(vs);
    return {
      ...o,
      slices: o.slices.map((s, i) => ({ ...s, v: vs[i] })),
      rows: o.rows.map((r, i) => ({ ...r, text: "$" + vs[i] + "K", pct: pc[i] + "%" })),
    };
  },
  describe: {
    title: "MRR by plan",
    summary: `Monthly recurring revenue of $184K by plan: Enterprise $82K (45%), Business $54K (29%), Team $31K (17%), Starter $17K (9%).`,
    table: { head: ["Plan", "MRR", "Share"], rows: data.rows.map((r) => [r.label, r.text, r.pct ?? ""]) },
  },
};
