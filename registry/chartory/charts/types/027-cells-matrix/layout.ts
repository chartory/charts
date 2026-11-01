// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 027 Cells matrix (Figma chart/027, "Prompt clusters by size"): C.matrix, four topic clusters over request sizes.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { matrix } from "../../plots/matrix";
import { data } from "./data";

const names: Record<string, string> = { "data/cat-2": "Code", "data/cat-3": "Support", "data/cat-6": "Search", "data/cat-5": "Agents", "data/track": "Unclustered" };

/** Tooltip for one cell (group = the cell's index in `cells`): request size and topic, its cluster and density (the
 *  marked cell adds its request count). */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const cell = o.cells[g];
  if (!cell) return null;
  const [r, c, tok, strong] = cell;
  const req = o.cross && o.cross.r === r && o.cross.c === c ? " · " + o.cross.text : "";
  return { kind: "cell", caps: `${o.rows[r]} TOKENS · TOPIC ${c + 1}`, value: names[tok] ?? "Cluster", swatch: tok, share: (strong ? "HIGH DENSITY" : "LOW DENSITY") + req };
}

export const def: ChartDef = {
  no: 27,
  slug: "cells-matrix",
  legend: [["data/cat-2", "Code"], ["data/cat-3", "Support"], ["data/cat-6", "Search"], ["data/cat-5", "Agents"]],
  // update: the next week; a few cells change density (dense ↔ sparse, deterministic per step) and the crosshair
  // follows the busiest dense Support cell at 2K tokens, with its request count
  update: (d, step) => {
    const o = d as typeof data;
    const cells = o.cells.map(([r, c, tok, strong], i) => [r, c, tok, (i * 7 + step * 3) % 11 === 0 ? !strong : strong] as typeof o.cells[number]);
    const busy = cells.filter(([r, , tok, strong]) => r === o.cross!.r && tok === "data/cat-3" && strong).map(([, c]) => c);
    const c = busy[step % busy.length] ?? o.cross!.c;
    const req = Math.round(1284 * (1 + 0.09 * Math.sin(step * 2.3 + 0.4)));
    return { ...o, cells, cross: { ...o.cross!, c, text: req.toLocaleString("en-US") + " REQ" } };
  },
  plot: (K, p, w, d) => matrix(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Prompt clusters by size",
    summary: `Requests of the last 7 days by request size (128 to 16K tokens) and topic (16 columns), in four clusters: Code sits at the large sizes, Search and Agents at the small ones; the marked 2K cell in Support holds 1,284 requests.`,
    table: {
      head: ["Request size", "Topic", "Cluster", "Density"],
      rows: data.cells.map(([r, c, tok, strong]) => [data.rows[r], c + 1, names[tok], strong ? "High" : "Low"]),
    },
  },
};
