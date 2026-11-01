// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 037 Gantt · sample data (Figma chart/037, logistics: today's truck schedule on 6 docks, 06:00 to 14:00, now 10:30).
import type { GanttData } from "../../plots/gantt";

export const data: GanttData = {
  yW: 64,
  rows: ["Dock 1", "Dock 2", "Dock 3", "Dock 4", "Dock 5", "Dock 6"],
  start: 6,
  end: 14,
  ticks: [[6, "06:00"], [8, "08:00"], [10, "10:00"], [12, "12:00"], [14, "14:00"]],
  now: 10.5,
  bars: [
    [0, 6, 7.4, "status/success", "TR-104"], [0, 7.6, 9.8, "data/cat-2", "TR-131"], [0, 10.2, 12.6, "status/success", "TR-220"],
    [1, 6.3, 8.9, "data/cat-2", "TR-112"], [1, 9.2, 11.4, "status/danger", "TR-217 · late"], [1, 11.8, 13.6, "status/success", "TR-236"],
    [2, 6, 6.8, "status/warning", "Wait"], [2, 7, 9.5, "status/success", "TR-145"], [2, 10, 13.2, "data/cat-2", "TR-251"],
    [3, 6.5, 10.8, "status/success", "TR-162 · bulk"], [3, 11.2, 13.8, "status/warning", "Waiting"],
    [4, 7.2, 8.6, "data/cat-2", "TR-178"], [4, 9, 11, "status/success", "TR-190"], [4, 11.4, 12.4, "data/cat-2", "TR-203"],
    [5, 6, 9, "status/warning", "Maintenance"], [5, 9.6, 12.2, "status/success", "TR-244"],
  ],
};
