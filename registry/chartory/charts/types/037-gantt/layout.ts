// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 037 Gantt (Figma chart/037): C.gantt on the dock schedule sample.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { gantt } from "../../plots/gantt";
import { data } from "./data";

const legend: [string, string][] = [["status/success", "Loading"], ["data/cat-2", "Unloading"], ["status/warning", "Waiting"], ["status/danger", "Delayed"]];
const state = (tok: string) => legend.find((l) => l[0] === tok)![1];
const hm = (h: number) => String(Math.floor(h)).padStart(2, "0") + ":" + String(Math.round((h % 1) * 60)).padStart(2, "0");
const late = data.bars.filter((b) => b[3] === "status/danger").length;

type Bar = (typeof data.bars)[number];
const q = (h: number) => Math.round(h * 20) / 20;
function later(o: typeof data, step: number, amp: number): typeof data {
  const now = o.now! + 0.05 * step;
  const bars = o.bars.map(([r, a, b, tok, label], i): Bar => {
    const m = amp * 0.25 * Math.sin(step * 1.9 + i * 1.3);
    if (b <= now) return [r, a, b, tok, label];
    if (a <= now) return [r, a, q(b + Math.abs(m)), tok, label];
    const a1 = Math.max(q(now + 0.05), q(a + m));
    return [r, a1, q(a1 + b - a), tok, label];
  });
  for (let i = 0; i < bars.length; i++) {
    const cur = bars[i], prev = bars[i - 1], next = bars[i + 1];
    if (prev?.[0] === cur[0] && cur[1] < prev[2] + 0.1) { const dur = cur[2] - cur[1]; cur[1] = q(prev[2] + 0.1); cur[2] = q(cur[1] + dur); }
    const lim = next?.[0] === cur[0] ? next[1] - 0.1 : o.end;
    if (cur[2] > lim) cur[2] = q(lim);
  }
  return { ...o, now, bars };
}

// A job's label shows when it fits the job's width in whole pixels, which differs per size; the update takes the
// largest shift (of 1, ¾, ½ …) that keeps every variant's marks.
const shape = (d: unknown) => (["xs", "s", "m", "l"] as Size[]).flatMap((s) => [true, false].map((lg) => buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" ? m.style : m.name)).join("\n"))).join("\n\n");
let base: string | undefined;
const keep = <T>(make: (a: number) => T): T => {
  base ??= shape(data);
  for (const a of [1, 0.8, 0.6, 0.4, 0.2]) { const c = make(a); if (shape(c) === base) return c; }
  return make(0);
};

/** Tooltip for one slot (group = the slot's index): dock and truck, its state with the time window, its duration. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const b = o.bars[g];
  if (!b) return null;
  const [r, a, e, tok, label] = b, min = Math.round((e - a) * 60);
  return {
    kind: "range", caps: `${o.rows[r]} · ${label}`.toUpperCase(),
    rows: [{ label: state(tok), value: hm(a) + "–" + hm(e), swatch: tok }, { label: "Duration", value: ((min >= 60 ? Math.floor(min / 60) + " h " : "") + (min % 60 ? (min % 60) + " min" : "")).trim(), swatch: tok }],
  };
}

export const def: ChartDef = {
  no: 37,
  slug: "gantt",
  legend,
  // update: the schedule a few minutes on (now +3 min per step); finished slots stay, running ones run over by up to
  // 15 min, slots that have not started slip or move up by up to 15 min with their duration (never before now, never
  // into the slot before them, never past the day's end)
  update: (d, step) => keep((amp) => later(d as typeof data, step, amp)),
  plot: (K, p, w, d) => gantt(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Dock schedule",
    summary: `${data.bars.length} slots on ${data.rows.length} docks from ${hm(data.start)} to ${hm(data.end)}, now ${hm(data.now!)}; ${late} truck delayed.`,
    table: { head: ["Dock", "Slot", "From", "To", "State"], rows: data.bars.map(([r, a, b, tok, label]) => [data.rows[r], label, hm(a), hm(b), state(tok)]) },
  },
};
