// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 074 Flame graph (Figma chart/074-flame-agent-trace): C.flame on one agent run; the legend names the span kinds.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { flame } from "../../plots/flame";
import { data } from "./data";

const legend: [string, string][] = [["data/primary", "Model"], ["data/cat-2", "Tool"], ["data/cat-3", "Retrieval"], ["data/cat-5", "Wait"]];
const kind = (tok: string) => legend.find((l) => l[0] === tok)![1];
const sec = (v: number) => v.toFixed(1) + " s";
const search = data.spans.find((s) => s.label === "web.search")!;

/** The marks a variant draws, texts named by their own characters counted by kind only (their content may change). */
const marks = (d: unknown, s: Size, lg: boolean) =>
  buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" && m.name === m.text.slice(0, 40) ? "" : m.name)).join("\n");
/** True when b draws the same marks as a at every size, legend on and off (labels shown by width stay). */
const sameMarks = (a: unknown, b: unknown) => (["xs", "s", "m", "l"] as Size[]).every((s) => [true, false].every((lg) => marks(a, s, lg) === marks(b, s, lg)));

// tooltip: one span (group = span index): start, end and duration, swatch = the span's kind colour
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const s = o.spans[g];
  if (!s) return null;
  const k = legend.find((l) => l[0] === s.tok)?.[1];
  return {
    kind: "range",
    caps: s.label.toUpperCase() + (k ? " · " + k.toUpperCase() : "") + " · DEPTH " + s.d,
    rows: [{ label: "Start", value: sec(s.s), swatch: s.tok }, { label: "End", value: sec(s.e), swatch: s.tok }, { label: "Duration", value: sec(s.e - s.s), swatch: s.tok }],
  };
};

export const def: ChartDef = {
  no: 74,
  slug: "flame-graph",
  legend,
  plot: (K, p, w, d) => flame(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the next run of the same agent: span edges move by a smooth time warp over one stretch of the run (monotonic, the
  // stretch's ends fixed), so every span stays inside its parent and siblings stay end to end; per step a different
  // stretch: research runs faster, planning runs longer, the draft runs longer. A span's label shows by its width, so
  // the first warp (this step's, then the others, then at half strength) that shows the same labels at every size is taken.
  update: (d, step) => {
    const o = d as typeof data;
    const warps: [number, number, number][] = [[1.1, o.total, -0.2], [0, 5.6, 0.15], [5.6, o.total, 0.3]];
    const at = ([t0, t1, a]: [number, number, number]) => {
      const T = (t: number) => (t <= t0 || t >= t1 ? t : Math.round((t + a * Math.sin((Math.PI * (t - t0)) / (t1 - t0))) * 10) / 10);
      return { ...o, spans: o.spans.map((s) => ({ ...s, s: T(s.s), e: T(s.e) })) };
    };
    const k = (step - 1) % 3, order = [...warps.slice(k), ...warps.slice(0, k)];
    return [...order, ...order.map(([t0, t1, a]) => [t0, t1, a / 2] as [number, number, number])].map(at).find((c) => sameMarks(o, c)) ?? o;
  },
  describe: {
    title: "Agent trace",
    summary: `One agent run of ${sec(data.total)} in ${data.spans.length} spans over ${Math.max(...data.spans.map((s) => s.d)) + 1} levels; web.search takes ${sec(search.e - search.s)}.`,
    table: {
      head: ["Span", "Depth", "Start", "End", "Duration", "Kind"],
      rows: data.spans.map((s) => [s.label, s.d, sec(s.s), sec(s.e), sec(s.e - s.s), kind(s.tok)]),
    },
  },
};
