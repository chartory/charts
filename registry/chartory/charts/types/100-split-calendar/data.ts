// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 100 Split calendar · sample data (Figma chart/100, fintech: daily cash in / out in $K, September; day 1 is a Tuesday).
import type { SplitCalData } from "../../plots/split-cal";

export const data: SplitCalData = {
  days: [
    [48, 46], [72, 19], [30, 22], [61, 29], [0, 7], [0, 5], [71, 49], [78, 24], [60, 33], [45, 22], [20, 18], [0, 2], [0, 7], [54, 25], [164, 26],
    [24, 25], [58, 47], [35, 57], [0, 3], [0, 0], [65, 23], [20, 54], [46, 43], [20, 61], [59, 50], [0, 6], [0, 4], [73, 50], [78, 31], [74, 178],
  ],
  start: 1,
  max: 210,
  rows: [
    { label: "Biggest in", text: "Sep 15", pct: "$164K" },
    { label: "Biggest out", text: "Sep 30", pct: "$178K" },
    { label: "Quiet days", text: "8", pct: "WEEKENDS" },
  ],
};
