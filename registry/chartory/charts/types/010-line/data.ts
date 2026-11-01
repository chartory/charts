// 010 Line · sample data (Figma chart/010-line, AI: p95 time to first token in us-east, hourly over the last 24 h).
import type { LineData } from "../../plots/line";

export const data: LineData = {
  vals: [0.9, 1.1, 0.95, 1.2, 0.85, 1.0, 1.3, 1.05, 1.15, 0.9, 1.25, 1.4, 1.1, 1.0, 1.35, 1.2, 0.95, 1.1, 1.45, 1.15, 1.05, 1.3, 1.2, 1.3],
  min: 0,
  max: 1.8,
  ticks: ["1.8 S", "1.2 S", "0.6 S", "0"],
  area: "flat",
  dots: "all",
  xl: { 0: "00:00", 6: "06:00", 12: "12:00", 18: "18:00", 23: "NOW" },
};
