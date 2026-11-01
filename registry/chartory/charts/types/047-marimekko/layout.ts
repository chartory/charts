// 047 Marimekko (Figma chart/047): C.marimekko on the region × category sales sample.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { marimekko } from "../../plots/marimekko";
import { data } from "./data";

const cats = ["Apparel", "Home", "Electronics", "Beauty"];
const pct = (v: number, of: number) => Math.round((v / of) * 100) + "%";
const tot = data.cols.reduce((a, c) => a + c.share, 0);
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

/** One set of whole points moved by up to ±3 (`seed` picks the pattern), still summing to the same total: the last
 *  entry takes the rest. */
const mix = (vs: number[], seed: number) => {
  const out = vs.map((v, i) => (i === vs.length - 1 ? 0 : Math.max(2, Math.round(v + 3 * Math.sin(seed + i * 1.7)))));
  out[vs.length - 1] = vs.reduce((s, v) => s + v, 0) - out.reduce((s, v) => s + v, 0);
  return out;
};

// Percent labels show in cells of 20 × 40 px and up and column labels shorten when narrow, differently at every size
// (several cells sit exactly on 20 px). The next quarter moves each region's category mix, then the region shares,
// one set at a time: each takes the first pattern that keeps every variant's marks, or stays.
const shape = (d: unknown) => (["xs", "s", "m", "l"] as Size[]).flatMap((s) => [true, false].map((lg) => buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" ? m.style : m.name)).join("\n"))).join("\n\n");
let base: string | undefined;
function later(o: typeof data, step: number): typeof data {
  base ??= shape(data);
  let cur = o;
  const tryAll = (make: (seed: number) => typeof data) => {
    for (let k = 0; k < 16; k++) { const c = make(step * 1.9 + k * 0.85); if (shape(c) === base) { cur = c; return; } }
  };
  for (let i = 0; i < o.cols.length; i++) tryAll((seed) => ({ ...cur, cols: cur.cols.map((c, j) => (j === i ? { ...c, parts: mix(c.parts, seed + i * 2.3) } : c)) }));
  tryAll((seed) => { const sh = mix(cur.cols.map((c) => c.share), seed); return { ...cur, cols: cur.cols.map((c, j) => ({ ...c, share: sh[j] })) }; });
  return cur;
}

/** Tooltip for one region (group = the region's column of cells): its share of sales and its category mix. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const c = o.cols[g];
  if (!c) return null;
  const all = o.cols.reduce((a, x) => a + x.share, 0), ps = sum(c.parts);
  return { kind: "series", caps: `${c.label} · ${pct(c.share, all)} OF SALES`, rows: c.parts.map((v, j) => ({ label: cats[j] ?? "Other", value: pct(v, ps), swatch: o.toks[j] })) };
}

export const def: ChartDef = {
  no: 47,
  slug: "marimekko",
  legend: [["data/cat-1", "Apparel"], ["data/cat-2", "Home"], ["data/cat-3", "Electronics"], ["data/cat-5", "Beauty"]],
  // update: the next quarter (see later)
  update: (d, step) => later(d as typeof data, step),
  plot: (K, p, w, d) => marimekko(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Sales by region and category, Q3",
    summary: `Q3 net sales by region: ${data.cols.map((c) => `${c.label} ${pct(c.share, tot)}`).join(", ")}; Electronics is ${pct(data.cols[2].parts[2], sum(data.cols[2].parts))} of APAC, Apparel ${pct(data.cols[1].parts[0], sum(data.cols[1].parts))} of EU.`,
    table: { head: ["Region", "Share of sales", ...cats], rows: data.cols.map((c) => [c.label, pct(c.share, tot), ...c.parts.map((v) => pct(v, sum(c.parts)))]) },
  },
};
