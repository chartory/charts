// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 055 Response length by model · sample data (Figma chart/055, from the Figma definition, seeded values expanded).
import type { RidgelineData } from "../../plots/ridgeline";

export const data: RidgelineData = {
  max: 2000,
  xt: [
    [0, "0"],
    [500, "500"],
    [1000, "1K"],
    [1500, "1.5K"],
    [2000, "2K TOKENS"]
  ],
  rows: [
    {
      label: "ATLAS 3",
      tok: "data/primary",
      peaks: [
        [540, 180, 1],
        [1250, 220, 0.35]
      ]
    },
    {
      label: "KITE 2",
      tok: "data/cat-2",
      peaks: [
        [380, 140, 1]
      ]
    },
    {
      label: "ORION",
      tok: "data/cat-3",
      peaks: [
        [900, 300, 1],
        [1600, 200, 0.4]
      ]
    },
    {
      label: "VEGA",
      tok: "data/cat-4",
      peaks: [
        [260, 90, 1],
        [700, 160, 0.25]
      ]
    },
    {
      label: "NOVA",
      tok: "data/cat-5",
      peaks: [
        [620, 240, 1]
      ]
    }
  ]
};
