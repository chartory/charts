// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 025 Calendar heatmap · sample data (Figma chart/025, dev tools: production deploys per day over 20 weeks, May → Sep;
// one column per week, Mon → Sun; -1 = days still to come).
import type { CalendarData } from "../../plots/calendar";

export const data: CalendarData = {
  vals: [
    [0, 3, 2, 1, 0, 0, 0], [3, 3, 3, 2, 2, 0, 1], [3, 0, 1, 1, 2, 0, 0], [0, 0, 2, 0, 4, 1, 0], [1, 3, 2, 4, 1, 0, 0],
    [3, 1, 2, 2, 3, 0, 0], [4, 2, 1, 3, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0], [4, 3, 1, 0, 0, 1, 0], [1, 1, 0, 2, 3, 0, 1],
    [2, 2, 0, 3, 0, 1, 1], [2, 4, 1, 1, 1, 1, 0], [1, 0, 2, 4, 4, 0, 1], [5, 6, 2, 2, 2, 0, 1], [5, 2, 4, 6, 5, 0, 1],
    [2, 6, 5, 3, 4, 1, 0], [3, 4, 6, 6, 2, 1, 0], [5, 5, 2, 2, 2, 0, 0], [6, 3, 3, 2, 3, 0, 1], [5, 5, 5, 4, -1, -1, -1],
  ],
  months: { 0: "MAY", 4: "JUN", 9: "JUL", 13: "AUG", 17: "SEP" },
};
