// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 056 ETH price bricks · sample data (Figma chart/056, from the Figma definition, seeded values expanded).
import type { RenkoData } from "../../plots/renko";

export const data: RenkoData = {
  start: 2400,
  size: 50,
  moves: "UUUDUUUUDDUUUUUDDDUUUUDUUUUDDUUU",
  min: 2350,
  max: 3150,
  ticks: ["3,150", "2,883", "2,617", "2,350"],
  xl: { 0: "SEP 10", 16: "SEP 25", 31: "OCT 9" }
};
