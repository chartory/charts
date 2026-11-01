// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 077 Lorenz curve · sample data (Figma chart/077, crypto: stake concentration across validators, curve t^3.4).
import type { CurveRefData } from "../../plots/curve-ref";

export const data: CurveRefData = {
  mode: "lorenz",
  k: 3.4,
  mark: { x: 0.9, text: "TOP 10% HOLD 30%" },
  ticks: ["100%", "75%", "50%", "25%", "0"],
  xt: [[0, "0"], [0.25, "25%"], [0.5, "50%"], [0.75, "75%"], [1, "100%"]],
};
