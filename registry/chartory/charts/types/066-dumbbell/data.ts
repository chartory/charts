// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 066 Dumbbell · sample data (Figma chart/066, our price (a) against the rival's (b) per product, $).
import type { DumbbellData } from "../../plots/dumbbell";

export const data: DumbbellData = {
  min: 0, max: 200,
  xt: [[0, "$0"], [50, "$50"], [100, "$100"], [150, "$150"], [200, "$200"]],
  rows: [
    { label: "Trail runner", a: 129, b: 139 }, { label: "Rain shell", a: 179, b: 172 }, { label: "Fleece mid", a: 79, b: 89 },
    { label: "Daypack 20L", a: 64, b: 69 }, { label: "Wool beanie", a: 29, b: 24 }, { label: "Hiking pole", a: 49, b: 55 },
  ],
};
