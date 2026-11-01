// 029 Tile map · sample data (Figma chart/029, logistics: parcels delivered by country in October; tile = [code,
// column, row, ramp step 0–6]).
import type { TileMapData } from "../../plots/tile-map";

export const data: TileMapData = {
  tiles: [
    ["IS", 0, 0, 1], ["NO", 3, 0, 2], ["SE", 4, 0, 2], ["FI", 5, 0, 1], ["IE", 0, 1, 2], ["UK", 1, 1, 4], ["DK", 3, 1, 3], ["PL", 5, 1, 3],
    ["NL", 2, 2, 6], ["DE", 3, 2, 6], ["CZ", 4, 2, 2], ["BE", 2, 3, 5], ["FR", 1, 3, 4], ["AT", 4, 3, 3], ["ES", 0, 4, 3], ["IT", 3, 4, 3],
  ],
  rows: [
    { label: "Germany", tok: "data/seq-6", text: "12.4K" },
    { label: "Netherlands", tok: "data/seq-6", text: "10.1K" },
    { label: "Belgium", tok: "data/seq-5", text: "6.8K" },
    { label: "France", tok: "data/seq-4", text: "5.2K" },
  ],
};
