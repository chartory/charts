// 032 Funnel (Figma chart/032): C.funnel; no legend (every stage is labelled).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { funnel } from "../../plots/funnel";
import { data } from "./data";

const s = data.stages;

/** Tooltip for one stage (group = the stage): its count and the step conversion from the stage before. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const st = o.stages[g];
  if (!st) return null;
  if (g === 0 || !st.conv) return { kind: "compare", caps: st.label.toUpperCase(), value: st.text, delta: { text: "100%", tone: "neutral" }, comparison: "FUNNEL ENTRY" };
  return { kind: "compare", caps: st.label.toUpperCase(), value: st.text, delta: { text: st.conv, tone: "info" }, comparison: "VS " + o.stages[g - 1].label.toUpperCase() };
}

export const def: ChartDef = {
  no: 32,
  slug: "funnel",
  legend: null,
  // update: the next month's funnel; visits move ±8 %, each step conversion ±3 points, every count and conversion is
  // recomputed from the shown counts (one decimal in K) and the stage widths follow the counts a little
  update: (d, step) => {
    const o = d as typeof data;
    const shown = (v: number) => Math.round(v / 100) / 10;
    const n: number[] = [];
    o.stages.forEach((s, i) => {
      const base = parseFloat(s.text);
      if (i === 0) { n.push(shown(base * 1000 * (1 + 0.08 * Math.sin(step * 2.2)))); return; }
      const rate = base / parseFloat(o.stages[i - 1].text) + 0.03 * Math.sin(step * 1.6 + i * 1.9);
      n.push(Math.max(0.1, shown(n[i - 1] * 1000 * rate)));
    });
    const widths = o.widths.map((w, i) => (i === 0 || i >= n.length ? w : +(w * (1 + 0.04 * Math.sin(step * 1.6 + i * 1.9))).toFixed(3)));
    return {
      ...o,
      widths,
      stages: o.stages.map((s, i) => ({ ...s, text: n[i].toFixed(1) + "K", conv: s.conv && Math.round((n[i] / n[i - 1]) * 100) + "%" })),
    };
  },
  plot: (K, p, w, d) => funnel(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Trial funnel",
    summary: `September trial funnel: ${s[0].text} site visits, ${s[1].text} signups, ${s[2].text} activated, ${s[3].text} paid and ${s[4].text} on an annual plan.`,
    table: { head: ["Stage", "Count", "Step conversion"], rows: s.map((x) => [x.label, x.text, x.conv ?? ""]) },
  },
};
