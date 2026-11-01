// 072 Quadrant · sample data (Figma chart/072, product lines: x = sales growth %, y = gross margin %, r = revenue weight).
import type { QuadrantData } from "../../plots/quadrant";

export const data: QuadrantData = {
  xmin: -20, xmax: 60, ymin: 0, ymax: 60, mx: 15, my: 30,
  ticks: ["60%", "40%", "20%", "0"],
  xt: [[-20, "−20%"], [0, "0"], [20, "+20%"], [40, "+40%"], [60, "+60%"]],
  quads: ["PROTECT", "GROW", "REVIEW", "FIX MARGIN"],
  pts: [
    { label: "Linen", x: 42, y: 48, r: 9, show: true }, { label: "Denim", x: 8, y: 44, r: 11, show: true }, { label: "Knit", x: 28, y: 36, r: 6 },
    { label: "Socks", x: -8, y: 22, r: 5, show: true }, { label: "Boots", x: 34, y: 18, r: 8, show: true }, { label: "Caps", x: 4, y: 38, r: 4 },
    { label: "Belts", x: -12, y: 12, r: 4 }, { label: "Tees", x: 18, y: 26, r: 10 }, { label: "Scarf", x: 50, y: 34, r: 5 },
    { label: "Bags", x: 22, y: 52, r: 7 }, { label: "Kids", x: -2, y: 30, r: 6 }, { label: "Swim", x: 46, y: 14, r: 5 },
  ],
};
