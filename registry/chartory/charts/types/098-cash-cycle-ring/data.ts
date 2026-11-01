// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 098 Cash cycle ring · sample data (Figma chart/098, fintech: working capital days, Q3 2026).
import type { CycleRingData } from "../../plots/cycle-ring";

export const data: CycleRingData = {
  dio: 46,
  dso: 38,
  dpo: 43,
  max: 120,
  center: [["Display/M", "41 d", "strong"], ["Label/Caps", "CASH CYCLE", "label"]],
  rows: [
    { label: "Inventory", tok: "data/cat-2", text: "46 d" },
    { label: "Receivables", tok: "data/cat-3", text: "38 d" },
    { label: "Payables", tok: "data/primary", text: "43 d" },
  ],
};
