// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 038 Block timeline (Figma chart/038): C.blocks on the Q4 release train sample.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { blocks } from "../../plots/blocks";
import { data } from "./data";

const legend: [string, string][] = [["status/success", "Shipped"], ["data/cat-2", "In progress"], ["status/danger", "Blocked"], ["data/track", "Planned"]];
const all = data.cols.flatMap((c) => c.blocks.map((b) => ({ squad: c.name, b })));
const count = (tok: string) => all.filter((x) => x.b[1] === tok).length;
const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** Tooltip for one block (group = squad × 10 + the block's place in the squad): the item, its state and status. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const col = o.cols[Math.floor(g / 10)], b = col?.blocks[g % 10];
  if (!b) return null;
  const st = (legend.find((l) => l[0] === b[1])?.[1] ?? "").toUpperCase();
  return { kind: "cell", caps: col.name + " · Q4", value: b[2], swatch: b[1], share: st + (b[3] && b[3] !== st ? " · " + b[3] : "") };
}

export const def: ChartDef = {
  no: 38,
  slug: "block-timeline",
  legend,
  // update: days later in the quarter; items in progress count their days down (one a step). Block sizes stay: they
  // sit on the title / status-line thresholds (22 / 42 px) at several sizes, so a re-estimate would add or drop text
  update: (d, step) => {
    const o = d as typeof data;
    const left = (c?: string) => {
      const m = c?.match(/^(\d+) DAYS? LEFT$/);
      if (!m) return c;
      const n = Math.max(1, +m[1] - step);
      return n + (n === 1 ? " DAY LEFT" : " DAYS LEFT");
    };
    return { ...o, cols: o.cols.map((c) => ({ ...c, blocks: c.blocks.map(([w, tok, title, caps]) => [w, tok, title, left(caps)] as typeof c.blocks[number]) })) };
  },
  plot: (K, p, w, d) => blocks(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Release train · Q4",
    summary: `${all.length} Q4 items across ${data.cols.length} squads: ${count("status/success")} shipped, ${count("data/cat-2")} in progress, ${count("status/danger")} blocked, ${count("data/track")} planned.`,
    table: { head: ["Squad", "Item", "State", "Status"], rows: all.map(({ squad, b }) => [cap(squad), b[2], legend.find((l) => l[0] === b[1])![1], cap(b[3] ?? "")]) },
  },
};
