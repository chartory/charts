// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 059 Shelf availability · sample data (Figma chart/059, from the Figma definition, seeded values expanded).
import type { ShelfData } from "../../plots/shelf";

export const data: ShelfData = {
  low: 0.3,
  out: 0.02,
  shelves: [
    [
      { name: "OAT", w: 3, pct: 0 },
      { name: "SOY", w: 2, pct: 0.7 },
      { name: "WHOLE", w: 4, pct: 0.85 },
      { name: "SKIM", w: 3, pct: 0.55 },
      { name: "A2", w: 2, pct: 0.22 }
    ],
    [
      { name: "GREEK", w: 3, pct: 0.64 },
      { name: "SKYR", w: 3, pct: 0.9 },
      { name: "KEFIR", w: 2, pct: 0 },
      { name: "PLAIN", w: 4, pct: 0.76 },
      { name: "KIDS", w: 2, pct: 0.18 }
    ],
    [
      { name: "BRIE", w: 2, pct: 0.5 },
      { name: "FETA", w: 2, pct: 0.81 },
      { name: "CHEDDAR", w: 4, pct: 0.68 },
      { name: "GOUDA", w: 3, pct: 0 },
      { name: "MOZZ", w: 3, pct: 0.92 }
    ]
  ]
};
