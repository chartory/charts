// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 026 Cohort · sample data (Figma chart/026, SaaS: net revenue retention by monthly cohort, M0–M5; label = month ·
// accounts). The name column is 72 px on plots wider than 480, else 64.
import type { CohortData } from "../../plots/cohort";

export const data: Omit<CohortData, "yW"> = {
  cols: ["M0", "M1", "M2", "M3", "M4", "M5"],
  lo: 78,
  hi: 100,
  fmt: (v) => v + "%",
  cohorts: [
    { label: "APR · 412", vals: [100, 91, 86, 83, 81, 80] },
    { label: "MAY · 388", vals: [100, 93, 88, 85, 84] },
    { label: "JUN · 455", vals: [100, 92, 87, 86] },
    { label: "JUL · 471", vals: [100, 95, 91] },
    { label: "AUG · 502", vals: [100, 94] },
    { label: "SEP · 536", vals: [100] },
  ],
};
