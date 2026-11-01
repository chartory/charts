// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 092 Tachograph · sample data (Figma chart/092, logistics: today's driver activity from the tachograph cards).
import type { TachoData } from "../../plots/tacho";

export const data: TachoData = {
  kinds: { drive: "data/primary", work: "status/warning", rest: "status/success", avail: "data/cat-2" },
  center: [["Label/Caps", "24 H", "label"], ["Label/Caps", "DISC", "label"]],
  drivers: [
    { label: "R. Silva", segs: [[5.5, 6, "work"], [6, 10.5, "drive"], [10.5, 11.25, "rest"], [11.25, 14.75, "drive"], [14.75, 15.5, "work"]] },
    { label: "T. Brandt", segs: [[5, 6, "work"], [6, 9, "drive"], [9, 9.75, "rest"], [9.75, 13.25, "drive"], [13.25, 14, "avail"]] },
    { label: "M. Kaya", segs: [[6.5, 7, "work"], [7, 11.5, "drive"], [11.5, 12.25, "rest"], [12.25, 16.25, "drive"], [16.25, 17, "work"]] },
  ],
  rows: [
    { label: "R. Silva", text: "8.0 h", pct: "DRIVE" },
    { label: "T. Brandt", text: "6.5 h", pct: "DRIVE" },
    { label: "M. Kaya", text: "8.5 h", pct: "DRIVE", tone: "status/warning" },
  ],
};
