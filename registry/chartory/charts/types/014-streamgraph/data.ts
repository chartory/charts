// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 014 · sample data (Figma chart/014-streamgraph, logistics: monthly shipments by mode in K, 2026).
import type { Stream2Data } from "../../plots/stream2";

export const data: Stream2Data = {
  now: 9,
  nowLabel: "OCT · 47K",
  xl: { 0: "JAN", 3: "APR", 6: "JUL", 9: "OCT", 11: "DEC" },
  layers: [
    { name: "Road", tok: "data/primary", vals: [14, 13, 16, 19, 22, 24, 23, 21, 22, 23, 30, 27] },
    { name: "Sea", tok: "data/cat-2", vals: [9, 8, 10, 12, 15, 17, 19, 18, 15, 10, 10, 9] },
    { name: "Rail", tok: "data/cat-3", vals: [6, 6, 7, 8, 8, 7, 6, 6, 8, 8, 9, 8] },
    { name: "Air", tok: "data/cat-5", vals: [2, 2, 3, 3, 4, 4, 4, 4, 5, 6, 10, 12] },
  ],
};
