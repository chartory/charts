// 018 Semi donut (Figma chart/018): C.semiDonut; no card legend (the plot carries its own legend with the shares).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { semiDonut } from "../../plots/semi-donut";
import { data } from "./data";
import { frame, type Frame, type Text } from "../../core/node";

/** Deterministic wave in [-1, 1] per index and update step (no randomness: the same step gives the same period). */
const wave = (i: number, step: number, f = 1.7) => Math.sin(step * 2.3 + i * f + 0.5);
/** A text is named by its characters, so an update state takes the sample's text names (same order): its value
 *  labels then stay the same marks and morph in place instead of reading as new ones. */
function keepNames(pl: Frame, ref: Frame): Frame {
  const texts = (f: Frame): Text[] => f.children.flatMap((c) => (c.removed ? [] : c.kind === "text" ? [c] : c.kind === "frame" ? texts(c) : []));
  const a = texts(pl), b = texts(ref);
  if (a.length === b.length) a.forEach((t, i) => { if (t.name === t.text.slice(0, 40)) t.name = b[i].name; });
  return pl;
}

const tot = data.items.reduce((a, s) => a + s.v, 0);
const pct = (v: number) => Math.round((v / tot) * 100) + "%";

/** Hover tooltip: one channel's segment and its share of orders. */
const tip = (d: unknown, g: number): TooltipSpec => {
  const o = d as typeof data, tot = o.items.reduce((a, s) => a + s.v, 0), s = o.items[g];
  return { kind: "value", text: `${s.label} · ${Math.round((s.v / tot) * 100)}% of orders` };
};

export const def: ChartDef = {
  no: 18,
  slug: "semi-donut",
  legend: null,
  plot: (K, p, w, d) => {
    const o = (d as typeof data | undefined) ?? data;
    const pl = semiDonut(K, p, w, o);
    return o === data ? pl : keepNames(pl, semiDonut(K, frame(null, "sample"), w, data));
  },
  tip,
  update: (d, step) => {
    const o = d as typeof data;
    // later weeks: each channel moves ±12 %; the order total follows the channel sum (the plot recomputes the shares)
    const tot0 = o.items.reduce((a, s) => a + s.v, 0);
    const items = o.items.map((s, i) => ({ ...s, v: Math.max(1, Math.round(s.v * (1 + 0.12 * wave(i, step)))) }));
    const tot = items.reduce((a, s) => a + s.v, 0);
    const orders = Math.round((Number(o.value.replace(/,/g, "")) * tot) / tot0);
    return { ...o, items, value: orders.toLocaleString("en-US") };
  },
  describe: {
    title: "Orders by channel",
    summary: `${data.value} orders by channel: ${data.items.map((s) => `${s.label} ${pct(s.v)}`).join(", ")}.`,
    table: { head: ["Channel", "Share"], rows: data.items.map((s) => [s.label, pct(s.v)]) },
  },
};
