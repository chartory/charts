// 068 Icicle (Figma chart/068, "Inference spend"): C.icicle, spend by team and project.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { icicle } from "../../plots/icicle";
import { data } from "./data";

const total = +data.teams.reduce((a, t) => a + t.v, 0).toFixed(1);

const r1 = (v: number) => Math.round(v * 10) / 10;
/** The marks a variant draws, texts named by their own characters counted by kind only (their content may change). */
const marks = (d: unknown, s: Size, lg: boolean) =>
  buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" && m.name === m.text.slice(0, 40) ? "" : m.name)).join("\n");
/** True when b draws the same marks as a at every size, legend on and off (labels shown by width stay). */
const sameMarks = (a: unknown, b: unknown) => (["xs", "s", "m", "l"] as Size[]).every((s) => [true, false].every((lg) => marks(a, s, lg) === marks(b, s, lg)));

// tooltip: one team with its projects (group = team): one row per project, the team's spend as the total
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const t = o.teams[g];
  if (!t) return null;
  const all = o.teams.reduce((a, q) => a + q.v, 0);
  return {
    kind: "series",
    caps: t.label.toUpperCase() + " · " + Math.round(all ? (t.v / all) * 100 : 0) + "% OF SPEND",
    rows: t.kids.map((q) => ({ label: q.label, value: o.fmt(q.v), swatch: t.tok })),
    total: { label: t.label, value: o.fmt(t.v) },
  };
};

export const def: ChartDef = {
  no: 68,
  slug: "icicle",
  legend: [["data/cat-2", "Support"], ["data/cat-3", "Search"], ["data/primary", "Agents"], ["data/cat-5", "Labs"]],
  plot: (K, p, w, d) => icicle(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next month: every project's spend moves up to ±10 %; team totals are the sums of their projects. A box's
  // name and value show by its width, so the first move (largest first, then
  // other phases) that shows the same labels at every size is taken.
  update: (d, step) => {
    const o = d as typeof data;
    const at = (amp: number, ph: number) => {
      let i = 0;
      return {
        ...o,
        teams: o.teams.map((t) => {
          const kids = t.kids.map((q) => ({ ...q, v: r1(q.v * (1 + amp * Math.sin(i++ * 1.7 + step * 2.2 + ph))) }));
          return { ...t, v: r1(kids.reduce((a, q) => a + q.v, 0)), kids };
        }),
      };
    };
    return [0.1, 0.06, 0.03].flatMap((a) => [0, 1.1, 2.3].map((ph) => at(a, ph))).find((c) => sameMarks(o, c)) ?? o;
  },
  describe: {
    title: "Spend breakdown",
    summary: `Inference spend of ${data.fmt(total)} across ${data.teams.length} teams: Support ${data.fmt(18.4)}, Search ${data.fmt(12.1)}, Agents ${data.fmt(10.6)}, Labs ${data.fmt(7.1)}; the largest project is Chat bot at ${data.fmt(11.2)}.`,
    table: { head: ["Team", "Project", "Spend"], rows: data.teams.flatMap((t) => t.kids.map((q) => [t.label, q.label, data.fmt(q.v)])) },
  },
};
