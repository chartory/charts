// 008 Bullet (Figma chart/008-bullet): C.bullet on the Q3 goals sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { bullet } from "../../plots/bullet";
import { data, rows } from "./data";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
type Data = ReturnType<typeof data>;
/** The sample is a function of the plot width (label column 112 / 96); update states are too. */
const at = (d: unknown, w: number): Data => (typeof d === "function" ? (d as typeof data)(w) : (d as Data | undefined) ?? data(w));
/** Each goal's own value format, as in the sample ($428K, 6,120, $70, 31%). */
const FMT: Record<string, (v: number) => string> = {
  Revenue: (v) => "$" + v + "K",
  Orders: (v) => v.toLocaleString("en-US"),
  "Avg order": (v) => "$" + v,
  "Repeat buyers": (v) => v + "%",
};

const of = (t: string) => t.replace(/^OF /, "");

/** Hover tooltip: one goal's actual against its target (the gap in the goal's own format; share goals in points). */
const tip = (d: unknown, g: number): TooltipSpec => {
  const r = at(d, 440).rows[g], gap = r.v - r.target;
  const diff = r.sub === "SHARE" ? Math.abs(gap) + (Math.abs(gap) === 1 ? " pt" : " pts") : FMT[r.label](Math.abs(gap));
  return {
    kind: "compare",
    caps: r.label.toUpperCase() + " · Q3",
    value: r.text,
    delta: { text: (gap < 0 ? "−" : "+") + diff, tone: gap >= 0 ? "success" : r.v < r.bands[0] ? "danger" : "warning" },
    comparison: "VS TARGET " + of(r.ttext),
  };
};

export const def: ChartDef = {
  no: 8,
  slug: "bullet",
  legend: [["data/primary", "Actual"], ["text/strong", "Target"], ["data/track", "Ranges"]],
  plot: (K, p, w, d) => bullet(K, p, w, at(d, w)),
  tip,
  // later weeks of the quarter: each actual moves 4 % a step with a ±6 % swing, inside its range; targets hold
  update: (d, step) => (w: number): Data => {
    const o = at(d, w);
    return {
      ...o,
      rows: o.rows.map((r, i) => {
        const v = Math.min(Math.round(r.max * 0.98), Math.max(1, Math.round(r.v * (1 + 0.04 * step + 0.06 * wave(i, step)))));
        return { ...r, v, text: FMT[r.label](v) };
      }),
    };
  },
  describe: {
    title: "Q3 goals",
    summary: `Q3 goals, actual against target: ${rows.map((r) => `${r.label.toLowerCase()} ${r.text} of ${of(r.ttext)}`).join(", ")}.`,
    table: { head: ["Goal", "Unit", "Actual", "Target"], rows: rows.map((r) => [r.label, r.sub.charAt(0) + r.sub.slice(1).toLowerCase(), r.text, of(r.ttext)]) },
  },
};
