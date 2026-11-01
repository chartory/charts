// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 079 Milestone track (Figma chart/079-milestones-onboarding): C.milestones on the onboarding steps; no legend.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { milestones } from "../../plots/milestones";
import { data } from "./data";

const last = data.steps[data.steps.length - 1];
const day = (s: string) => "Day " + s.split(" ")[1];

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** A later cohort: every step after sign-up reaches a different share, still falling step by step. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  const steps = d.steps.map((s) => ({ ...s }));
  for (let i = 1; i < steps.length; i++) steps[i].pct = Math.min(steps[i - 1].pct - 4, Math.max(5, Math.round(steps[i].pct * (1 + 0.15 * wob(i, step)))));
  return { steps };
}

/** Hover: one step (its ring, its % and the link into it): the share reached, against the step before. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const s = (d0 as typeof data).steps, q = s[g];
  if (!q) return null;
  if (g === 0) return { kind: "value", text: `${q.label} · ${day(q.day)} · ${q.pct}%` };
  const dv = q.pct - s[g - 1].pct;
  return { kind: "compare", caps: `${day(q.day)} · ${q.label}`.toUpperCase(), value: q.pct + "%", delta: { text: (dv < 0 ? "−" : "+") + Math.abs(dv) + " pt", tone: "neutral" }, comparison: "VS " + s[g - 1].label.toUpperCase() };
}

export const def: ChartDef = {
  no: 79,
  slug: "milestone-track",
  legend: null,
  plot: (K, p, w, d) => milestones(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Onboarding milestones",
    summary: `Share of sign-ups reaching each of ${data.steps.length} onboarding steps, from ${data.steps[0].pct}% signed up to ${last.pct}% paid by ${day(last.day).toLowerCase()}.`,
    table: { head: ["Step", "Day", "Reached"], rows: data.steps.map((s) => [s.label, day(s.day), s.pct + "%"]) },
  },
};
