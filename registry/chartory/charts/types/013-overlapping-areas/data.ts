// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 013 · sample data (Figma chart/013-overlapping-areas, crypto: daily spot volume per venue in $M, Sep 10 → Oct 9; the seeded walk the Figma builder generated).
import type { MultiLineData } from "../../plots/multi-line";

export const data: MultiLineData = {
  area: 0.22,
  sw: 1.5,
  min: 0,
  max: 600,
  ticks: ["600M", "400M", "200M", "0"],
  xl: { 0: "SEP 10", 10: "SEP 20", 20: "SEP 30", 29: "OCT 9" },
  series: [
    { name: "northgate", tok: "data/cat-2", vals: [383.6, 403.93, 391.64, 396.65, 365.02, 396.26, 372.21, 400.1, 432.36, 469.64, 484.54, 440.97, 434.45, 406.33, 386.69, 350.04, 346.64, 320.9, 339.2, 380.3, 392.9, 374.72, 406.67, 394.59, 389.83, 433.51, 456.14, 433.01, 416.98, 455.32] },
    { name: "tidepool", tok: "data/cat-3", vals: [273.34, 250.11, 264.17, 248.22, 256.91, 266.17, 294.59, 321.93, 352.79, 333.23, 356.03, 325.75, 308.68, 309.76, 291.13, 324.57, 335.71, 325.56, 343.51, 371.78, 339.19, 360.45, 368.86, 380, 380, 380, 380, 363.88, 357.29, 326.46] },
    { name: "ardent", tok: "data/cat-1", vals: [118.28, 137.03, 127.7, 138.21, 133.09, 148.4, 142.92, 127.09, 113.6, 90.53, 85.28, 97.57, 94.09, 77.12, 67.07, 66.93, 87.14, 60, 79.65, 108.07, 89.33, 105.79, 113.56, 103.05, 96.12, 122.29, 95.39, 112.46, 93.1, 107.99] },
  ],
};
