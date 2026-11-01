// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 050 Dot plot with intervals · sample data (Figma chart/050, logistics: on-time rate by carrier, 95 % confidence, SLA 95 %).
import type { CiDotsData } from "../../plots/ci-dots";

export const data: CiDotsData = {
  min: 85,
  max: 100,
  target: 95,
  ticks: [[85, "85%"], [90, "90%"], [95, "SLA 95%"], [100, "100%"]],
  rows: [
    { label: "Nordline", v: 97.2, lo: 96.4, hi: 98.0 },
    { label: "Rapida", v: 96.4, lo: 95.7, hi: 97.1 },
    { label: "Parcelo", v: 95.8, lo: 94.1, hi: 97.5 },
    { label: "Swift EU", v: 94.1, lo: 92.8, hi: 95.4 },
    { label: "Cargo One", v: 92.6, lo: 90.2, hi: 95.0 },
    { label: "Lumen Post", v: 89.8, lo: 86.5, hi: 93.1 },
  ],
};
