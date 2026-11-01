// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 002 · sample data (Figma chart/002-grouped-bars, SaaS: new paid accounts by plan, Jul → Dec 2026).
import type { GroupedData } from "../../plots/grouped";

export const data: GroupedData = {
  cats: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  max: 600,
  ticks: ["600", "400", "200", "0"],
  series: [
    { name: "starter", tok: "data/cat-1", vals: [420, 460, 510, 480, 540, 570] },
    { name: "team", tok: "data/cat-2", vals: [260, 300, 290, 340, 360, 410] },
    { name: "business", tok: "data/cat-3", vals: [110, 120, 150, 140, 170, 190] },
  ],
};
