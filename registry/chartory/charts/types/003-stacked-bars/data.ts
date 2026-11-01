// 003 Stacked bars · sample data (Figma chart/003-stacked-bars, fintech: failed payments per week by reason, W27 → W40).
import type { VStackData } from "../../plots/v-stack";

export const data: VStackData = {
  max: 600,
  ticks: ["600", "400", "200", "0"],
  labels: { 0: "W27", 3: "W30", 6: "W33", 9: "W36", 13: "W40" },
  stacks: [
    {  name: "card declined", tok: "data/cat-1", vals: [304, 296, 298, 279, 269, 262, 249, 237, 219, 188, 171, 152, 136, 118]  },
    {  name: "insufficient funds", tok: "data/cat-2", vals: [166, 161, 162, 152, 147, 143, 136, 129, 119, 103, 93, 83, 74, 64]  },
    {  name: "fraud block", tok: "data/cat-3", vals: [82, 81, 81, 76, 73, 71, 67, 65, 60, 51, 47, 41, 37, 32]  },
  ],
};
