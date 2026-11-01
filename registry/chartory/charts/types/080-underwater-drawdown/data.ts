// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 080 Underwater drawdown · sample data (Figma chart/080-underwater-fund, fintech: a fund's weekly drawdown from its
// running peak, Jan to Oct; the seeded series from the definition, expanded).
import type { UnderwaterData } from "../../plots/underwater";

const vals = [
  -1.81, -0.16, -0.43, -0.7, -1.42, -1.34, 0, -1.46, -3.36, -6.49, -6.68, -7.28, -6.65, -5.74, -8.88, -8.74, -10.3, -9.51, -12.36, -14.04,
  -15.48, -16.47, -15.74, -13.64, -11.23, -11.44, -10.7, -10.34, -10.65, -10.8, -9.57, -10.2, -8.99, -5.82, -6.47, -4.62, -3.42, -0.76, 0, 0,
  -0.81, -1.86, -2.75, -4.18, -6.36, -4.13, -6.01, -4.82, -3.88, -2.85, -1.77, -1.72, -3.52, -1.93, -2.28, -0.81, -2.81, -1.46, -3.21, -3.76,
];
const low = Math.min(...vals);

export const data: UnderwaterData = {
  vals,
  min: -20,
  ticks: ["0", "−5%", "−10%", "−15%", "−20%"],
  xl: { 0: "JAN", 20: "APR", 40: "JUL", 59: "OCT" },
  mark: { i: vals.indexOf(low), text: "MAX " + low.toFixed(1).replace("-", "−") + "%" },
};
