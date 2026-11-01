// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 045 Bump (Figma chart/045-bump-volume-rank): C.bump; no legend (names at the line ends).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { bump } from "../../plots/bump";
import { data } from "./data";

const top = data.rows.map((r) => [r.label, r.ranks.filter((x) => x === 1).length] as const).sort((a, b) => b[1] - a[1])[0];
const focus = data.rows.find((r) => r.label === data.focus)!;

/** Tooltip for one asset (group = its line, dots and name): its rank in the last week against the first. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const r = o.rows[g];
  if (!r) return null;
  const a = r.ranks[0], b = r.ranks[r.ranks.length - 1], d = a - b;
  return {
    kind: "compare", caps: `${r.label.toUpperCase()} · ${o.cols[o.cols.length - 1]}`, value: "#" + b,
    delta: { text: d > 0 ? `Up ${d}` : d < 0 ? `Down ${-d}` : "Level", tone: d > 0 ? "success" : d < 0 ? "danger" : "neutral" }, comparison: `VS ${o.cols[0]} #${a}`,
  };
}

export const def: ChartDef = {
  no: 45,
  slug: "bump",
  legend: null,
  // update: revised weekly volumes; in some weeks two neighbouring ranks trade places (deterministic per step), so
  // every week is still a permutation of 1…n
  update: (d, step) => {
    const o = d as typeof data;
    const n = o.rows.length;
    const ranks = o.rows.map((r) => [...r.ranks]);
    o.cols.forEach((_, c) => {
      if ((c + step) % 3 === 0) return;
      const a = 1 + ((c * 2 + step) % (n - 1));
      const i = ranks.findIndex((r) => r[c] === a), j = ranks.findIndex((r) => r[c] === a + 1);
      ranks[i][c] = a + 1; ranks[j][c] = a;
    });
    return { ...o, rows: o.rows.map((r, i) => ({ ...r, ranks: ranks[i] })) };
  },
  plot: (K, p, w, d) => bump(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Weekly trading volume rank",
    summary: `Rank by weekly volume, ${data.cols[0]} to ${data.cols[data.cols.length - 1]}: ${top[0]} ranked first in ${top[1]} of ${data.cols.length} weeks; ${focus.label} ends at #${focus.ranks[focus.ranks.length - 1]}.`,
    table: { head: ["Asset", ...data.cols], rows: data.rows.map((r) => [r.label, ...r.ranks.map((x) => "#" + x)]) },
  },
};
