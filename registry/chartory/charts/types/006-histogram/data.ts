// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 006 Histogram · sample data (Figma chart/006-histogram, AI: response latency in 25 ms bins over 24 h, requests per
// bin; p50 and p95 marked). The bin counts are the series the Figma builder generated.
import type { HistData } from "../../plots/hist";

export const data: HistData = {
  vals: [60, 60, 297, 1845, 4755, 7829, 9963, 10800, 10537, 9569, 8264, 6884, 5588, 4451, 3497, 2720, 2100, 1614, 1236, 944, 721, 550, 420, 321, 245, 188, 144, 111, 85, 66, 60, 60, 60, 60, 60, 60],
  max: 15000,
  ticks: ["15K", "10K", "5K", "0"],
  tailFrom: 19,
  p: [
    {  i: 9, label: "P50 250 MS", tok: "text/strong", side: "left"  },
    {  i: 18, label: "P95 475 MS", tok: "data/primary-soft"  },
  ],
  xl: [[0, "0"], [9, "225 MS"], [18, "450 MS"], [27, "675 MS"], [36, "900 MS"]],
};
