// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 041 Orbit · sample data (Figma chart/041, crypto: active wallets this week by holder tier).
import type { Orbits2Data } from "../../plots/orbits2";

export const data: Orbits2Data = {
  active: 87,
  rings: [
    { label: "Whales", n: 12, size: 10, active: 92, tok: "data/primary", text: "42" },
    { label: "Large", n: 20, size: 8, active: 88, tok: "data/cat-4", text: "1.2K" },
    { label: "Mid", n: 30, size: 6, active: 81, tok: "data/cat-2", text: "6.8K" },
    { label: "Small", n: 44, size: 4, active: 64, tok: "data/cat-8", text: "10.2K" },
  ],
};
