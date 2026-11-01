// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 094 Radial lollipop · sample data (Figma chart/094-radial-hashrate, crypto: network hashrate in EH/s, Nov → Oct).
import type { RadialLollipopData } from "../../plots/radial-lollipop";

export const data: RadialLollipopData = {
  min: 560,
  max: 820,
  rings: [600, 700, 800],
  labels: ["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"],
  vals: [610, 628, 655, 640, 690, 720, 705, 748, 770, 762, 795, 812],
  center: [["Label/Caps", "EH/S", "label"], ["Label/Caps", "12 MO", "label"]],
  rows: [
    {  label: "Miner revenue", text: "$1.9M", pct: "24 H"  },
    {  label: "Hashprice", text: "$48", pct: "PH / DAY"  },
    {  label: "Difficulty", text: "+4.1%", pct: "IN 3 D", tone: "status/warning"  },
  ],
};
