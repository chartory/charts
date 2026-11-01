// 081 Context ruler (Figma chart/081-context-ruler): C.contextRuler on four support-agent requests in a 128K window.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { contextRuler } from "../../plots/context-ruler";
import { data } from "./data";

const total = (segs: number[]) => segs.reduce((a, b) => a + b, 0);
const past = data.rows.filter((r) => total(r.segs) > data.limit);

const wob = (i: number, step: number) => Math.sin(i * 2.1 + step * 1.7 + 0.4);
/** Later requests: history, tools, docs and output move (whole K, inside the window); the system prompt stays. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  let k = 0;
  return {
    ...d,
    rows: d.rows.map((r) => {
      const segs = r.segs.map((v, j) => (j === 0 ? v : Math.max(1, Math.round(v * (1 + 0.18 * wob(k++, step))))));
      const over = total(segs) - (d.max - 2);
      if (over > 0) segs[1] -= over;
      return { ...r, segs };
    }),
  };
}

/** Hover: one request (its stacked kinds): tokens per kind, the request total in the window. */
function tip(d0: unknown, g: number): TooltipSpec | null {
  const d = d0 as typeof data, r = d.rows[g];
  if (!r) return null;
  const rows = r.segs.flatMap((v, j) => (v ? [{ label: d.kinds[j].label, value: v + "K", swatch: d.kinds[j].tok }] : []));
  return { kind: "series", caps: `${r.label} · ${d.max}K WINDOW`, rows, total: { label: total(r.segs) > d.limit ? "Total · past compaction" : "Total", value: total(r.segs) + "K" } };
}

export const def: ChartDef = {
  no: 81,
  slug: "context-ruler",
  legend: data.kinds.map((k) => [k.tok, k.label]),
  plot: (K, p, w, d) => contextRuler(K, p, w, (d as typeof data | undefined) ?? data),
  tip,
  update,
  describe: {
    title: "Context window use",
    summary: `Tokens per request in a ${data.max}K window, compaction at ${data.limit}K: ${data.rows.map((r) => `${r.label} ${total(r.segs)}K`).join(", ")}; ${past.length} request past the compaction line.`,
    table: { head: ["Request", ...data.kinds.map((k) => k.label + " (K)"), "Total (K)"], rows: data.rows.map((r) => [r.label, ...r.segs, total(r.segs)]) },
  },
};
