// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 063 Likert · sample data (Figma chart/063, Q3 customer survey: share of answers per statement, strongly disagree → strongly agree, %).
import type { LikertData } from "../../plots/likert";

export const data: LikertData = {
  rows: [
    { label: "Easy to set up", v: [4, 8, 14, 42, 32] },
    { label: "Worth the price", v: [9, 17, 22, 34, 18] },
    { label: "Reports are clear", v: [3, 7, 18, 45, 27] },
    { label: "Support is fast", v: [6, 12, 20, 37, 25] },
    { label: "Would recommend", v: [5, 9, 16, 38, 32] },
  ],
};
