// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 004 · sample data (Figma chart/004-diverging-bars, fintech: weekly inflow and outflow in $K, W29 → W40).
import type { DivergeData } from "../../plots/diverge";

export const data: DivergeData = {
  max: 400,
  ticks: [[400, "400K"], [0, "0"], [-400, "−400K"]],
  up: [220, 260, 240, 300, 280, 330, 310, 290, 360, 340, 380, 350],
  down: [180, 210, 230, 200, 240, 220, 260, 250, 230, 270, 240, 260],
  xl: { 0: "W29", 4: "W33", 8: "W37", 11: "W40" },
};
