// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 034 Scatter · sample data (Figma chart/034, crypto: 30-day return against volatility per token; bubble size from the kit sample).
import type { ScatterData } from "../../plots/scatter";

export const data: ScatterData = {
  xmin: 20, xmax: 125, ymin: -20, ymax: 40,
  ticks: ["+40%", "+20%", "0", "−20%"],
  xt: [[30, "30% VOL"], [60, "60%"], [90, "90%"], [120, "120%"]],
  smax: 28,
  pts: [
    [38, 6, 28, "data/cat-1", "BTC"], [52, 9, 14, "data/cat-1", "ETH"], [74, 14, 4.2, "data/cat-1", "SOL"], [88, -6, 0.7, "data/cat-1", "AVAX"],
    [70, 3, 0.6, "data/cat-2", "LINK"], [82, -2, 0.5, "data/cat-2", "UNI"], [78, 18, 0.45, "data/cat-2", "AAVE"], [66, -9, 0.3, "data/cat-2", "MKR"],
    [96, 22, 1.8, "data/cat-6", "DOGE"], [118, 34, 0.9, "data/cat-6", "PEPE"], [104, -12, 0.6, "data/cat-6", "SHIB"], [114, -15, 0.4, "data/cat-6", "BONK"],
  ],
};
