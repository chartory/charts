// 089 Allocation drift · sample data (Figma chart/089-drift-rebalance).
import type { DriftArrowsData } from "../../plots/drift-arrows";

export const data: DriftArrowsData = {
  max: 40,
  xt: [[0, "0"], [10, "10%"], [20, "20%"], [30, "30%"], [40, "40%"]],
  rows: [{ label: "US equity", now: 38, target: 35 }, { label: "Intl equity", now: 14, target: 18 }, { label: "Bonds", now: 26, target: 28 }, { label: "Real estate", now: 8, target: 7 }, { label: "Gold", now: 6, target: 5 }, { label: "Cash", now: 8, target: 7 }],
};
