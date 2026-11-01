// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 005 · sample data (Figma chart/005-floating-range-bars, logistics: delivery window per route as [low, high, median] hour of day; SLA 10:30).
import type { FloatingData } from "../../plots/floating";

export const data: FloatingData = {
  cats: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8"],
  vals: [[8, 11, 9.5], [9, 13, 11], [7.5, 10, 8.5], [10, 15, 12.5], [8, 12, 10], [11, 16, 13], [9, 12, 10.5], [12, 17, 14]],
  sla: 10.5,
  min: 6,
  max: 18,
  ticks: ["18:00", "14:00", "10:00", "06:00"],
};
