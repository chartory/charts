// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 063 Likert (Figma chart/063, "Customer survey"): C.likert on five survey statements.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { likert } from "../../plots/likert";
import { data } from "./data";

const pct = (v: number) => v + "%";

const answers: [string, string][] = [["Strongly disagree", "status/danger"], ["Disagree", "status/danger"], ["Neutral", "data/track"], ["Agree", "status/success"], ["Strongly agree", "status/success"]];

// tooltip: one statement (group = row): the share of each answer, adding up to all answers
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const r = o.rows[g];
  if (!r) return null;
  return {
    kind: "series",
    caps: r.label.toUpperCase(),
    rows: answers.map(([label, swatch], j) => ({ label, value: pct(r.v[j]), swatch })),
    total: { label: "All answers", value: pct(r.v.reduce((a, b) => a + b, 0)) },
  };
};

export const def: ChartDef = {
  no: 63,
  slug: "likert",
  legend: [["status/danger", "Disagree"], ["data/track", "Neutral"], ["status/success", "Agree"]],
  plot: (K, p, w, d) => likert(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next quarter: points move between disagree and agree and between neutral and agree (each row still sums to 100)
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      rows: o.rows.map((r, k) => {
        const v = [...r.v] as typeof r.v;
        const t = Math.max(1 - v[3], Math.min(v[1] - 1, Math.round(3 * Math.sin(k * 1.7 + step * 2.2))));
        v[1] -= t; v[3] += t;
        const u = Math.max(1 - v[4], Math.min(v[2] - 1, Math.round(2 * Math.sin(k * 0.9 + step * 1.3))));
        v[2] -= u; v[4] += u;
        return { ...r, v };
      }),
    };
  },
  describe: {
    title: "Q3 survey",
    summary: `Answers to ${data.rows.length} survey statements: agreement ranges from 52% (Worth the price) to 74% (Easy to set up); disagreement from 10% to 26%.`,
    table: {
      head: ["Statement", "Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
      rows: data.rows.map((r) => [r.label, ...r.v.map(pct)]),
    },
  },
};
