// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 029 Tile map (Figma chart/029): C.tileMap; no legend (the side list names the top countries). Radius-bound: XS
// legend=off keeps the legend-on plot height (flatXs).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { tileMap } from "../../plots/tile-map";
import { data } from "./data";

const COUNTRY: Record<string, string> = {
  IS: "Iceland", NO: "Norway", SE: "Sweden", FI: "Finland", IE: "Ireland", UK: "United Kingdom", DK: "Denmark", PL: "Poland",
  NL: "Netherlands", DE: "Germany", CZ: "Czechia", BE: "Belgium", FR: "France", AT: "Austria", ES: "Spain", IT: "Italy",
};

/** Tooltip for one tile (group = the tile's index): the country, its parcels when the side list names it (else its
 *  volume step), the step's shade. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const t = o.tiles[g];
  if (!t) return null;
  const [code, , , v] = t, name = COUNTRY[code] ?? code, swatch = v === 0 ? "data/idle" : "data/seq-" + v;
  const ri = o.rows.findIndex((r) => r.label === name), row = o.rows[ri];
  if (row?.text) return { kind: "cell", caps: `${name} · ${code}`.toUpperCase(), value: row.text, unit: "parcels", swatch, share: `#${ri + 1} BY VOLUME · STEP ${v} OF 6` };
  return { kind: "cell", caps: `${name} · ${code}`.toUpperCase(), value: "Step " + v, unit: "of 6", swatch, share: `OUTSIDE THE TOP ${o.rows.length}` };
}

export const def: ChartDef = {
  no: 29,
  slug: "tile-map",
  legend: null,
  flatXs: true,
  // update: the next month; the listed leaders move 5–12 % (order kept, one decimal in K) and the smaller countries
  // step one shade up or down (1–3); the leaders' tiles keep the shade their list swatch shows
  update: (d, step) => {
    const o = d as typeof data;
    const lead = new Set(["DE", "NL", "BE", "FR"]);
    const rows = o.rows.map((r, i) => ({ ...r, text: (parseFloat(r.text!) * (1 + (0.05 + 0.07 * ((i + step) % 3) / 2) * (step % 2 ? 1 : -1))).toFixed(1) + "K" }));
    return {
      ...o,
      rows,
      tiles: o.tiles.map((t, i) => (lead.has(t[0]) || t[3] > 3 ? t : [t[0], t[1], t[2], Math.max(1, Math.min(3, t[3] + Math.round(Math.sin(step * 2.1 + i * 1.7))))] as typeof t)),
    };
  },
  plot: (K, p, w, d) => tileMap(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Deliveries by country",
    summary: `Parcels delivered in October across ${data.tiles.length} countries, shaded by volume: ${data.rows.map((r) => `${r.label} ${r.text}`).join(", ")} lead.`,
    table: {
      head: ["Country", "Volume step (0–6)"],
      rows: [...data.tiles].sort((a, b) => b[3] - a[3]).map((t) => [t[0], t[3]]),
    },
  },
};
