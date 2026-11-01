// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 042 Waterfall (Figma chart/042-waterfall-cash-bridge): C.waterfall on the cash bridge sample.
import { waterfall } from "../../plots/waterfall";
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { textWidth } from "../../core/text";
import { data } from "./data";

// A signed value shows only when it fits its step's band (band pitch − 4; at S some do not). A new flow takes the
// nearest cent whose label shows in exactly the variants where the sample's does.
const label = (v: number) => Math.ceil(textWidth((v > 0 ? "+" : "−") + data.fmt(Math.abs(v)), "Label/Caps"));
let room: { max: number; shown: Set<string> }[] | undefined;
const fits = (name: string, x: number) => {
  room ??= (["xs", "s", "m", "l"] as Size[]).flatMap((s) => [true, false].map((lg) => {
    const ms = buildVariant(def, s, lg, data).marks, st = ms.filter((m) => m.name.startsWith("step · "));
    return { max: st[1].ax - st[0].ax - 4, shown: new Set(ms.filter((m) => m.name.startsWith("value · ")).map((m) => m.name.slice(8))) };
  }));
  return room.every((r) => (label(x) <= r.max) === r.shown.has(name.toLowerCase()));
};
const near = (name: string, v: number, like: number) => {
  for (let c = 0; c <= 8; c++) for (const s of [1, -1]) { const x = Math.round((v + s * c * 0.01) * 100) / 100; if (Math.sign(x) === Math.sign(like) && fits(name, x)) return x; }
  return like;
};

/** The quarters after the sample, `step` on: each opens at the previous close, every flow moves ±15 % (cents of $M,
 *  signs kept) and the close is the opening balance plus the flows again. */
function later(o: typeof data, step: number): typeof data {
  let open = o.steps[0].v, steps = o.steps;
  for (let q = 1; q <= step; q++) {
    const flows = o.steps.map((s, i) => (s.total ? 0 : near(s.label, s.v * (1 + 0.15 * Math.sin(q * 2.1 + i * 1.3)), s.v)));
    const close = Math.round((open + flows.reduce((a, v) => a + v, 0)) * 100) / 100;
    steps = o.steps.map((s, i) => ({ ...s, v: !s.total ? flows[i] : i === 0 ? open : close }));
    open = close;
  }
  return { ...o, steps };
}

/** Tooltip for one step (group = the step's bar): a flow from the balance before to the balance after; the close
 *  against the open; the open on its own. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const s = o.steps[g];
  if (!s) return null;
  const money = (v: number) => "$" + o.fmt(v), signed = (v: number) => (v >= 0 ? "+$" : "−$") + o.fmt(Math.abs(v));
  let run = 0;
  for (let i = 0; i < g; i++) run = o.steps[i].total ? o.steps[i].v : run + o.steps[i].v;
  if (s.total && g === 0) return { kind: "value", text: `${s.label.charAt(0) + s.label.slice(1).toLowerCase()} · ${money(s.v)}` };
  if (s.total) {
    const open = o.steps[0].v;
    return { kind: "range", caps: s.label, rows: [{ label: "Open", value: money(open), swatch: "data/primary" }, { label: "Net change", value: signed(s.v - open), swatch: s.v >= open ? "status/success" : "status/danger" }, { label: "Close", value: money(s.v), swatch: "data/primary" }] };
  }
  return { kind: "range", caps: s.label, rows: [{ label: "Before", value: money(run), swatch: "data/primary" }, { label: "Change", value: signed(s.v), swatch: s.v >= 0 ? "status/success" : "status/danger" }, { label: "After", value: money(run + s.v), swatch: "data/primary" }] };
}

export const def: ChartDef = {
  no: 42,
  slug: "waterfall",
  legend: [["data/primary", "Balance"], ["status/success", "Inflow"], ["status/danger", "Outflow"]],
  // update: the following quarters (see later)
  update: (d, step) => later(d as typeof data, step),
  plot: (K, p, w, d) => waterfall(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Cash bridge, Q3",
    summary: `Cash from the opening balance of $${data.fmt(data.steps[0].v)} to the closing balance of $${data.fmt(data.steps[data.steps.length - 1].v)}: sales in, refunds, staff, cloud and tax out.`,
    table: {
      head: ["Step", "Change", "Balance"],
      rows: (() => {
        let run = 0;
        return data.steps.map((s) => {
          run = s.total ? s.v : run + s.v;
          return [s.label.charAt(0) + s.label.slice(1).toLowerCase(), s.total ? "" : (s.v > 0 ? "+$" : "−$") + data.fmt(Math.abs(s.v)), "$" + data.fmt(run)];
        });
      })(),
    },
  },
};
