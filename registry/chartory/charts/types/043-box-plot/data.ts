// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 043 Box plot · sample data (Figma chart/043, AI: response latency by model in ms, last 7 days).
import type { BoxPlotData } from "../../plots/box-plot";

export const data: BoxPlotData = {
  max: 1200,
  ticks: ["1.2S", "900", "600", "300", "0"],
  rows: [
    { label: "ATLAS 3", q: [180, 260, 320, 410, 620], out: [760] },
    { label: "KITE 2", q: [150, 210, 260, 330, 480] },
    { label: "ORION", q: [320, 480, 590, 760, 1040], out: [1150] },
    { label: "VEGA", q: [120, 170, 200, 240, 330], out: [420] },
    { label: "NOVA", q: [210, 300, 380, 520, 880] },
  ],
};
