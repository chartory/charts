// 073 Term cloud (Figma chart/073-term-cloud-support): C.cloud; the legend names the three tones.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { cloud } from "../../plots/cloud";
import { data } from "./data";

// weight tiers of C.cloud (Body/S … Display/M); the neutral colour also switches at 0.45, a tier edge
const TIERS = [0, 0.25, 0.45, 0.65, 0.85, 1];

// tooltip: one term (group = term index): weight and tone
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const w = o.words[g];
  if (!w) return null;
  const [t, wt, tone] = w;
  return { kind: "value", text: t + " · " + Math.round(wt * 100) + "% · " + (tone === "neg" ? "Negative" : tone === "pos" ? "Positive" : "Neutral") };
};

export const def: ChartDef = {
  no: 73,
  slug: "term-cloud",
  legend: [["status/danger", "Negative"], ["text/action", "Neutral"], ["status/success", "Positive"]],
  plot: (K, p, w, d) => cloud(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next week: every term's weight moves up to ±0.04 inside its own tier, so every term keeps its style; the
  // cloud then re-deals the terms of each tier over that tier's places (rotated by the step), so the terms trade
  // places and the wrapped rows re-flow while every place keeps its style (same marks, same sequence of styles)
  update: (d, step) => {
    const o = d as typeof data;
    const tierOf = (wt: number) => TIERS.findIndex((e, j) => wt >= e && wt < (TIERS[j + 1] ?? 2));
    const words = o.words.map(([t, wt, tone], i) => {
      const k = tierOf(wt);
      const v = Math.min(TIERS[k + 1] - 0.01, Math.max(TIERS[k] + 0.01, Math.round((wt + 0.04 * Math.sin(i * 1.9 + step * 2.3)) * 100) / 100));
      return (tone ? [t, v, tone] : [t, v]) as (typeof o.words)[number];
    });
    const out = [...words];
    for (let k = 0; k < TIERS.length - 1; k++) {
      const slots = words.map((w, i) => (tierOf(w[1]) === k ? i : -1)).filter((i) => i >= 0);
      slots.forEach((s, j) => { out[s] = words[slots[(j + step) % slots.length]]; });
    }
    return { ...o, words: out };
  },
  describe: {
    title: "Support topics",
    summary: `Support ticket topics sized by weight: "${[...data.words].sort((a, b) => b[1] - a[1])[0][0]}" is the largest; ${data.words.filter((x) => x[2] === "neg").length} topics read negative, ${data.words.filter((x) => x[2] === "pos").length} positive.`,
    table: {
      head: ["Topic", "Weight", "Tone"],
      rows: [...data.words].sort((a, b) => b[1] - a[1]).map(([t, wt, tone]) => [t, Math.round(wt * 100) + "%", tone === "neg" ? "Negative" : tone === "pos" ? "Positive" : "Neutral"]),
    },
  },
};
