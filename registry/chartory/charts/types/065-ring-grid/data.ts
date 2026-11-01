// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 065 Ring grid · sample data (Figma chart/065, same-day dispatch rate per site, %; good from 97, warn from 92).
import type { RingGridData } from "../../plots/ring-grid";

export const data: RingGridData = {
  good: 97, warn: 92,
  items: [
    { label: "Leeds", v: 98, sub: "4.1K ORDERS" }, { label: "Lyon", v: 97, sub: "3.6K ORDERS" },
    { label: "Porto", v: 91, sub: "2.2K ORDERS" }, { label: "Gdansk", v: 96, sub: "2.9K ORDERS" },
    { label: "Brno", v: 99, sub: "1.8K ORDERS" }, { label: "Turin", v: 94, sub: "2.4K ORDERS" },
    { label: "Ghent", v: 89, sub: "1.6K ORDERS" }, { label: "Malmo", v: 97, sub: "1.9K ORDERS" },
  ],
};
