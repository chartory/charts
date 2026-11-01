// 049 Parallel coordinates · sample data (Figma chart/049, AI: model eval scores 0–100 per measure, Atlas 3 in focus).
import type { ParallelData } from "../../plots/parallel";

export const data: ParallelData = {
  focus: "Atlas 3",
  axes: ["ACCURACY", "SPEED", "COST", "SAFETY", "CONTEXT"],
  rows: [
    { label: "Kite 2 Pro", tok: "data/cat-2", vals: [86, 82, 71, 90, 70] },
    { label: "Orion XL", tok: "data/cat-3", vals: [95, 38, 30, 93, 96] },
    { label: "Vega 1.5", tok: "data/cat-4", vals: [74, 94, 90, 85, 52] },
    { label: "Nova", tok: "data/cat-5", vals: [80, 70, 62, 78, 64] },
    { label: "Atlas 3", tok: "data/primary", vals: [92, 64, 48, 95, 88] },
  ],
};
