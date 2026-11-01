// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 031 Sankey · sample data (Figma chart/031, e-commerce: this week's sessions from source to outcome).
import type { SankeyData } from "../../plots/sankey";

export const data: SankeyData = {
  left: [
    {  label: "Search", tok: "data/cat-1", v: 4200  },
    {  label: "Social", tok: "data/cat-2", v: 2600  },
    {  label: "Email", tok: "data/cat-3", v: 1900  },
    {  label: "Direct", tok: "data/cat-5", v: 1300  },
  ],
  right: [
    {  label: "Purchased", v: 2100  },
    {  label: "Abandoned cart", v: 2600  },
    {  label: "Browsed", v: 3100  },
    {  label: "Bounced", v: 2200  },
  ],
  flows: [
    [0, 0, 1100], [0, 1, 1200], [0, 2, 1200], [0, 3, 700],
    [1, 0, 300], [1, 1, 600], [1, 2, 900], [1, 3, 800],
    [2, 0, 500], [2, 1, 500], [2, 2, 600], [2, 3, 300],
    [3, 0, 200], [3, 1, 300], [3, 2, 400], [3, 3, 400],
  ],
};
