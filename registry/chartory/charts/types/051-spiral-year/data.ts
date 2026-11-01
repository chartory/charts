// 051 Weekly active workspaces · sample data (Figma chart/051, from the Figma definition, seeded values expanded).
import type { SpiralData } from "../../plots/spiral";

export const data: SpiralData = {
  vals: [0.05, 0.39, 0.42, 0.49, 0.51, 0.51, 0.57, 0.5, 0.5, 0.57, 0.89, 0.5, 0.47, 0.5, 0.39, 0.39, 0.44, 0.42, 0.43, 0.37, 0.4, 0.52, 0.39, 0.48, 0.57, 0.51, 0.58, 0.61, 0.64, 0.64, 0.79, 0.83, 0.85, 0.81, 0.82, 0.7, 0.74, 0.71, 0.64, 0.61, 0.69, 0.65, 0.68, 0.58, 0.56, 0.7, 0.66, 0.74, 0.77, 0.83, 0.76, 0.48],
  turns: 2.5,
  center: [
    ["Label/Caps", "W1", "label"],
    ["Label/Caps", "START", "label"]
  ],
  rows: [
    { label: "Busiest", text: "W11", pct: "LAUNCH" },
    { label: "Quietest", text: "W1", pct: "NEW YEAR" },
    { label: "Streak", text: "9 wks", pct: "ABOVE 2K" }
  ]
};
