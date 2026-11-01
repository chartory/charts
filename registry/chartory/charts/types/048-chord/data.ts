// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 048 Chord · sample data (Figma chart/048, crypto: bridged volume between 5 chains this week, $M; [from, to, v]).
import type { ChordData } from "../../plots/chord";

export const data: ChordData = {
  fmt: (v) => "$" + v + "M",
  nodes: [
    { label: "Ethereum", tok: "data/cat-2" },
    { label: "Arbitrum", tok: "data/cat-3" },
    { label: "Base", tok: "data/primary" },
    { label: "Solana", tok: "data/cat-4" },
    { label: "Polygon", tok: "data/cat-5" },
  ],
  flows: [[0, 1, 210], [0, 2, 190], [1, 0, 160], [2, 0, 120], [0, 3, 95], [3, 0, 70], [1, 2, 105], [4, 0, 73], [3, 2, 144], [4, 1, 73]],
};
