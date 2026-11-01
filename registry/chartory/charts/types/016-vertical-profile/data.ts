// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 016 · sample data (Figma chart/016-vertical-profile, AI: needle recall in % by context length, two models).
import type { ProfileData } from "../../plots/profile";

export const data: ProfileData = {
  rows: ["4K", "16K", "32K", "64K", "128K"],
  min: 60,
  max: 100,
  xt: [[60, "60%"], [70, "70%"], [80, "80%"], [90, "90%"], [100, "100%"]],
  series: [
    { name: "atlas 3", tok: "data/primary", vals: [97, 95, 92, 86, 77] },
    { name: "kite 2 pro", tok: "data/cat-2", vals: [93, 92, 90, 88, 84] },
  ],
};
