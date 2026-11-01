// 060 Churn model lift · sample data (Figma chart/060, from the Figma definition, seeded values expanded).
import type { CurveRefData } from "../../plots/curve-ref";

export const data: CurveRefData = {
  mode: "gains",
  k: 4.2,
  mark: { x: 0.2, text: "TOP 20% → 61% OF CHURNERS" },
  ticks: ["100%", "75%", "50%", "25%", "0"],
  xt: [
    [0, "0"],
    [0.25, "25%"],
    [0.5, "50%"],
    [0.75, "75%"],
    [1, "100%"]
  ]
};
