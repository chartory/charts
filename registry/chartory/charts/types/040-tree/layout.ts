// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 040 Tree (Figma chart/040): C.tree2; no legend (each card names its status).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { tree2 } from "../../plots/tree2";
import { data } from "./data";

const [rel, epics, tasks] = data.levels;
const items = data.levels.flat();
const status = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const TONE: Record<string, string> = { shipped: "status/success", "in progress": "status/info", review: "status/warning", blocked: "status/danger", todo: "text/unselected", release: "data/primary" };

/** Tooltip for one item (group = the card with its link in, numbered level by level): level and parent, the item,
 *  its status and how many items hang under it. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  let k = 0;
  for (let l = 0; l < o.levels.length; l++)
    for (let i = 0; i < o.levels[l].length; i++, k++) {
      if (k !== g) continue;
      const it = o.levels[l][i], par = it.parent != null && l > 0 ? o.levels[l - 1][it.parent] : null;
      const kids = l + 1 < o.levels.length ? o.levels[l + 1].filter((c) => c.parent === i).length : 0;
      return {
        kind: "cell", caps: o.heads[l] + (par ? " · " + par.label.toUpperCase() : ""), value: it.label, swatch: TONE[it.status] ?? "text/unselected",
        share: it.status.toUpperCase() + (kids ? ` · ${kids} ${o.heads[l + 1]}` : ""),
      };
    }
  return null;
}

export const def: ChartDef = {
  no: 40,
  slug: "tree",
  legend: null,
  // update: the release a few days on; work moves one status forward per step (todo → in progress → review →
  // shipped), blocked items stay blocked and an epic ships once all its tasks have; cards keep their size and place
  update: (d, step) => {
    const o = d as typeof data;
    const flow = ["todo", "in progress", "review", "shipped"];
    const fwd = (s: string) => (flow.includes(s) ? flow[Math.min(flow.length - 1, flow.indexOf(s) + step)] : s);
    const tasks = o.levels[2].map((t) => ({ ...t, status: fwd(t.status) }));
    const epics = o.levels[1].map((e, i) => {
      const kids = tasks.filter((t) => t.parent === i);
      return { ...e, status: e.status === "blocked" || e.status === "shipped" ? e.status : kids.every((t) => t.status === "shipped") ? "shipped" : kids.some((t) => t.status !== "todo") ? "in progress" : e.status };
    });
    return { ...o, levels: [o.levels[0], epics, tasks] };
  },
  plot: (K, p, w, d) => tree2(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Release dependencies",
    summary: `Release ${rel[0].label} depends on ${epics.length} epics and ${tasks.length} tasks; ${items.filter((x) => x.status === "blocked").length} items are blocked and ${items.filter((x) => x.status === "shipped").length} have shipped.`,
    table: {
      head: ["Item", "Level", "Parent", "Status"],
      rows: data.levels.flatMap((lv, l) => lv.map((it) => [it.label, data.heads[l].charAt(0) + data.heads[l].slice(1).toLowerCase(), it.parent != null ? data.levels[l - 1][it.parent].label : "–", status(it.status)])),
    },
  },
};
