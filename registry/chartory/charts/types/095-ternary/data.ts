// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 095 Ternary · sample data (Figma chart/095, AI: production models placed by their quality / speed / low-cost mix).
import type { TernaryData } from "../../plots/ternary";

export const data: TernaryData = {
  corners: ["QUALITY", "SPEED", "LOW COST"],
  pts: [
    { label: "Atlas 3", a: 0.5, b: 0.2, c: 0.3, r: 9, tok: "data/primary" },
    { label: "Kite 2 Pro", a: 0.3, b: 0.42, c: 0.28, r: 7, tok: "data/cat-2" },
    { label: "Orion XL", a: 0.72, b: 0.1, c: 0.18, r: 6, tok: "data/cat-3" },
    { label: "Vega 1.5", a: 0.14, b: 0.5, c: 0.36, r: 8, tok: "data/cat-4" },
    { label: "Nova", a: 0.22, b: 0.22, c: 0.56, r: 5, tok: "data/cat-5" },
  ],
};
