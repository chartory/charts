// 022 Sunburst (Figma chart/022, "Token spend by team"): C.sunburst, teams inside, models outside, team list beside.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { sunburst } from "../../plots/sunburst";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

const k = (v: number) => "$" + (v / 10).toFixed(1) + "K";
const team = (g: (typeof data.groups)[number]) => g.items.reduce((s, i) => s + i[1], 0);

/** Hover tooltip: one team (inner ring and its models), a row per model and the team total. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const t = (d as typeof data).groups[g];
  return {
    kind: "series",
    caps: t.label.toUpperCase() + " · TOKEN SPEND",
    rows: t.items.map(([n, v]) => ({ label: n, value: k(v), swatch: t.tok })),
    total: { label: "Total", value: k(team(t)) },
  };
};

export const def: ChartDef = {
  no: 22,
  slug: "sunburst",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = sunburst(K, p, w, o);
    return o === data ? pl : keepNames(pl, sunburst(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later in the month: each model's spend moves ±12 % ($100s); the centre total follows (team totals: the plot)
    const groups = o.groups.map((g, gi) => ({ ...g, items: g.items.map(([n, v], k) => [n, Math.max(1, Math.round(v * (1 + 0.12 * wave(gi * 3 + k, step))))] as [string, number]) }));
    const tot = groups.reduce((a, g) => a + g.items.reduce((s, i) => s + i[1], 0), 0);
    return { ...o, groups, center: { ...o.center, value: "$" + (tot / 10).toFixed(1) + "K" } };
  },
  describe: {
    title: "Token spend by team and model",
    summary: `Token spend of $48.2K this month by team: ${data.groups.map((g) => g.label + " " + k(team(g))).join(", ")}; the largest single model is Research's Atlas 3 at ${k(138)}.`,
    table: { head: ["Team", "Model", "Spend"], rows: data.groups.flatMap((g) => g.items.map((i) => [g.label, i[0], k(i[1])])) },
  },
};
