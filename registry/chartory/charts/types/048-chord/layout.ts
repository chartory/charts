// 048 Chord (Figma chart/048): C.chord; no legend (the side list names every chain).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { chord } from "../../plots/chord";
import { data } from "./data";

const tot = data.flows.reduce((a, f) => a + f[2], 0);
const net = data.nodes.map((_, i) => data.flows.reduce((s, f) => s + (f[1] === i ? f[2] : 0) - (f[0] === i ? f[2] : 0), 0));
const signed = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + data.fmt(Math.abs(v));
const top = net.indexOf(Math.max(...net)), low = net.indexOf(Math.min(...net));

// Ribbon ends are polylines with one point per started 0.08 rad of their flow's arc, so a flow keeps its point count
// only while its angle stays in the same 0.08 rad step (angles are shares of all flows: k rad per $M).
const GAP = 0.06, STEP = 0.08;
const kOf = (fl: [number, number, number][], n: number) => (2 * Math.PI - n * GAP) / (2 * fl.reduce((a, f) => a + f[2], 0));
const pts = (fl: [number, number, number][], n: number) => { const k = kOf(fl, n); return fl.map((f) => Math.max(2, Math.ceil((f[2] * k) / STEP))); };
const netOf = (fl: [number, number, number][], n: number) => Array.from({ length: n }, (_, i) => fl.reduce((s, f) => s + (f[1] === i ? f[2] : 0) - (f[0] === i ? f[2] : 0), 0));

/** Next week's bridging, `step` on: every flow moves up to ±12 % (whole $M), pulled back inside its 0.08 rad step;
 *  each chain keeps its direction (net in / net out). The first amplitude (of 1, ¾, ½, ¼) that keeps both wins. */
function later(o: typeof data, step: number): typeof data {
  const n = o.nodes.length, p0 = pts(o.flows, n), s0 = netOf(o.flows, n).map(Math.sign);
  for (const a of [1, 0.75, 0.5, 0.25]) {
    let fl = o.flows.map(([f, t, v], i) => [f, t, v * (1 + a * 0.12 * Math.sin(step * 1.8 + i * 1.1))] as [number, number, number]);
    for (let it = 0; it < 6; it++) {
      const k = kOf(fl, n);
      fl = fl.map(([f, t, v], i) => [f, t, Math.round(Math.min(Math.max(v * k, (p0[i] - 1) * STEP + 0.006), p0[i] * STEP - 0.006) / k)]);
    }
    if (pts(fl, n).every((x, i) => x === p0[i]) && netOf(fl, n).every((x, i) => Math.sign(x) === s0[i])) return { ...o, flows: fl };
  }
  return o;
}

/** Tooltip for one chain (group = its arc and the ribbons it sends): where its volume went, the total sent, and its
 *  net flow (in − out). */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const n = o.nodes[g];
  if (!n) return null;
  const out = o.flows.filter((f) => f[0] === g), sent = out.reduce((s, f) => s + f[2], 0);
  const nt = o.flows.reduce((s, f) => s + (f[1] === g ? f[2] : 0), 0) - sent;
  return {
    kind: "series", caps: `${n.label.toUpperCase()} · NET ${(nt > 0 ? "+" : nt < 0 ? "−" : "") + o.fmt(Math.abs(nt))}`,
    rows: out.map(([, t, v]) => ({ label: "To " + o.nodes[t].label, value: o.fmt(v), swatch: o.nodes[t].tok })), total: { label: "Sent", value: o.fmt(sent) },
  };
}

export const def: ChartDef = {
  no: 48,
  slug: "chord",
  legend: null,
  // update: next week's bridging (see later)
  update: (d, step) => later(d as typeof data, step),
  plot: (K, p, w, d) => chord(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Bridge flows between chains",
    summary: `${data.fmt(tot)} bridged between ${data.nodes.length} chains this week; ${data.nodes[top].label} has the largest net inflow (${signed(net[top])}), ${data.nodes[low].label} the largest net outflow (${signed(net[low])}).`,
    table: {
      head: ["From", "To", "Volume"],
      rows: data.flows.map(([f, t, v]) => [data.nodes[f].label, data.nodes[t].label, data.fmt(v)]),
    },
  },
};
