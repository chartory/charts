// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 028 Hex grid · sample data (Figma chart/028, e-commerce: this week's click density on 3 key pages; each blob is
// [x, y, spread, weight] in the page's unit space).
import type { HexbinData } from "../../plots/hexbin";

export const data: HexbinData = {
  panels: [
    { name: "Home", sub: "14.2K CLICKS", blobs: [[0.5, 0.22, 0.18, 1], [0.25, 0.72, 0.15, 0.6]] },
    { name: "Product", sub: "16.1K CLICKS", blobs: [[0.72, 0.55, 0.15, 1], [0.3, 0.3, 0.2, 0.7]] },
    { name: "Checkout", sub: "8.3K CLICKS", blobs: [[0.5, 0.86, 0.14, 1], [0.5, 0.4, 0.18, 0.5]] },
  ],
};
