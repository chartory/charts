// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 061 Event barcode · sample data (Figma chart/061, request outcomes over the last 24 h on 3 services; events seeded).
import type { BarcodeData } from "../../plots/barcode";

export const data: BarcodeData = {
  seed: 61,
  weights: [0.05, 0.03, 0.02, 0.02, 0.03, 0.08, 0.2, 0.4, 0.62, 0.74, 0.8, 0.76, 0.66, 0.7, 0.74, 0.8, 0.88, 0.95, 1, 0.86, 0.6, 0.38, 0.2, 0.1],
  xl: { 0: "00:00", 6: "06:00", 12: "12:00", 18: "18:00", 24: "NOW" },
  rows: [
    { label: "Chat API", n: 150, err: 0.02, slow: 0.06 },
    { label: "Embeddings", n: 110, err: 0.005, slow: 0.02 },
    { label: "Agents", n: 90, err: 0.06, slow: 0.12 },
  ],
};
