// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 099 Pass/fail grid · sample data (Figma chart/099, AI: release eval gate v4.2, models × suites; p pass, f fail, x flaky).
import type { PassGridData } from "../../plots/pass-grid";

export const data: PassGridData = {
  models: ["Atlas 3", "Kite 2 Pro", "Orion XL", "Vega 1.5", "Nova"],
  suites: ["MATH", "CODE", "LAW", "MED", "SQL", "VIS", "TOOL", "SAFE"],
  m: [
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["p", "p", "f", "p", "p", "x", "p", "p"],
    ["p", "p", "p", "p", "f", "p", "p", "p"],
    ["p", "f", "x", "p", "p", "p", "p", "p"],
    ["p", "p", "p", "p", "p", "f", "p", "p"],
  ],
};
