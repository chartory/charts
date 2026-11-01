// 009 Lollipop · sample data (Figma chart/009-lollipop, fintech: new deposits in October by region, $K).
import type { LollipopData } from "../../plots/lollipop";

export const data: LollipopData = {
  max: 650,
  rows: [
    ["East", 478, "data/cat-2", "$478K"],
    ["Midwest", 386, "data/cat-4", "$386K"],
    ["South", 596, "data/cat-3", "$596K"],
    ["West", 174, "data/cat-9", "$174K"],
  ],
};
