// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 044 Slope · sample data (Figma chart/044, e-commerce: store conversion by channel, September → October).
import type { SlopeData } from "../../plots/slope";

export const data: SlopeData = {
  left: "SEP",
  right: "OCT",
  min: 1.2,
  max: 5.6,
  fmt: (v) => v.toFixed(1) + "%",
  rows: [
    { label: "Email", a: 4.1, b: 5.2 },
    { label: "Search", a: 3.2, b: 3.6 },
    { label: "Direct", a: 2.7, b: 3.1 },
    { label: "Social", a: 2.2, b: 1.9 },
    { label: "Affiliate", a: 1.6, b: 2.3 },
  ],
};
