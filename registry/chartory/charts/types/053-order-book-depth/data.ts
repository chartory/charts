// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 053 Order book depth · sample data (Figma chart/053, from the Figma definition, seeded values expanded).
import type { DepthData } from "../../plots/depth";

export const data: DepthData = {
  bids: [
    [64170, 10],
    [64130, 21],
    [64090, 24],
    [64050, 27],
    [64010, 40],
    [63970, 43],
    [63930, 49],
    [63890, 56],
    [63850, 67],
    [63810, 82],
    [63770, 86],
    [63730, 90],
    [63690, 97],
    [63650, 100],
    [63610, 112]
  ],
  asks: [
    [64250, 3],
    [64290, 7],
    [64330, 14],
    [64370, 17],
    [64410, 21],
    [64450, 38],
    [64490, 41],
    [64530, 46],
    [64570, 52],
    [64610, 55],
    [64650, 64],
    [64690, 84],
    [64730, 88],
    [64770, 94],
    [64810, 98]
  ],
  mid: 64210,
  min: 63610,
  max: 64810,
  qmax: 120,
  ticks: ["120", "80", "40", "0"],
  midText: "MID 64,210",
  xt: [
    [63610, "63.6K"],
    [63910, "63.9K"],
    [64510, "64.5K"],
    [64810, "64.8K"]
  ]
};
