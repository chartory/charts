// 023 Radar · sample data (Figma chart/023, AI: model comparison, eval scores out of 100 on six axes).
import type { RadarData } from "../../plots/radar";

export const data: RadarData = {
  axes: ["REASONING", "CODE", "MATH", "TOOL USE", "SPEED", "COST"],
  max: 100,
  series: [
    {  name: "Kite 2 Pro", tok: "data/cat-2", vals: [76, 85, 70, 81, 77, 72]  },
    {  name: "Atlas 3", tok: "data/primary", vals: [88, 82, 79, 74, 58, 46]  },
  ],
};
