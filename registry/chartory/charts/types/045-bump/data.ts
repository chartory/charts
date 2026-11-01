// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 045 Bump · sample data (Figma chart/045-bump-volume-rank, crypto: weekly trading-volume rank, Solana in focus).
import type { BumpData } from "../../plots/bump";

export const data: BumpData = {
  focus: "Solana",
  cols: ["W33", "W34", "W35", "W36", "W37", "W38", "W39", "W40"],
  rows: [
    {  label: "Ethereum", tok: "data/cat-2", ranks: [1, 1, 2, 1, 1, 1, 2, 1]  },
    {  label: "Solana", tok: "data/primary", ranks: [2, 2, 1, 2, 3, 2, 1, 2]  },
    {  label: "XRP", tok: "data/cat-3", ranks: [3, 4, 3, 3, 2, 3, 3, 4]  },
    {  label: "Toncoin", tok: "data/cat-4", ranks: [4, 5, 5, 4, 5, 4, 4, 5]  },
    {  label: "Dogecoin", tok: "data/cat-5", ranks: [5, 3, 4, 5, 4, 5, 5, 3]  },
  ],
};
