// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 062 Rate dot plot · sample data (Figma chart/062, policy rate projections per member, September round).
import type { RateDotsData } from "../../plots/rate-dots";

export const data: RateDotsData = {
  min: 2.0, max: 4.5,
  ticks: ["4.5%", "3.67%", "2.83%", "2.0%"],
  cols: [
    { label: "2026", dots: [3.875, 3.875, 3.875, 3.625, 3.625, 3.625, 3.625, 3.625, 3.375, 3.375, 3.375, 3.125, 3.875, 4.125, 3.625] },
    { label: "2027", dots: [3.375, 3.375, 3.125, 3.125, 3.375, 3.625, 3.375, 2.875, 3.125, 3.375, 3.625, 3.875, 3.375, 2.875, 3.125] },
    { label: "2028", dots: [3.125, 2.875, 2.875, 3.125, 3.375, 2.625, 3.125, 2.875, 3.125, 3.375, 2.875, 3.625, 3.125, 2.625, 2.875] },
    { label: "LONGER RUN", dots: [2.875, 3.0, 3.0, 2.875, 3.125, 2.75, 3.0, 2.875, 3.0, 3.25, 2.75, 3.0, 3.0, 2.875, 3.125] },
  ],
};
