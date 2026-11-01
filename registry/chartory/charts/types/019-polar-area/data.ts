// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 019 Polar area · sample data (Figma chart/019, SaaS: new trial signups by channel in September, 13.8K in all).
import type { PolarData } from "../../plots/polar";

const items: [string, number, string][] = [
  ["Organic", 4200, "data/cat-1"], ["Paid search", 3400, "data/cat-2"], ["Referral", 2600, "data/cat-3"],
  ["Social", 1800, "data/cat-4"], ["Partners", 1200, "data/cat-5"], ["Events", 600, "data/cat-6"],
];
export const data: PolarData = {
  items: items.map(([label, v, tok]) => ({ label, v, tok, text: (v / 1000).toFixed(1) + "K", pct: Math.round(v / 138) + "%" })),
};
