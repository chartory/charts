// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 046 Bar and line combo · sample data (Figma chart/046, SaaS: new MRR in $K and monthly churn rate in %, 2026).
import type { ComboData } from "../../plots/combo";

export const data: ComboData = {
  cats: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT"],
  xl: [0, 3, 6, 9],
  bars: { tok: "data/primary", max: 60, ticks: ["60K", "40K", "20K", "0"], vals: [28, 31, 30, 35, 38, 36, 41, 44, 42, 47] },
  line: { tok: "data/cat-2", max: 3, ticks: ["3%", "2%", "1%", "0"], vals: [2.4, 2.2, 2.3, 2.0, 1.9, 1.8, 1.7, 1.6, 1.7, 1.5] },
};
