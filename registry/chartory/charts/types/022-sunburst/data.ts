// 022 Sunburst · sample data (Figma chart/022, AI: token spend by team › model, October month to date, in $100s).
import type { SunburstData } from "../../plots/sunburst";

export const data: SunburstData = {
  center: { value: "$48.2K", caps: "THIS MONTH" },
  groups: [
    {  label: "Research", tok: "data/cat-1", items: [["Atlas 3", 138], ["Orion XL", 64]]  },
    {  label: "Support", tok: "data/cat-2", items: [["Kite 2 Pro", 96], ["Pico 2", 41], ["Nova Mini", 22]]  },
    {  label: "Search", tok: "data/cat-3", items: [["Vega 1.5", 58], ["Lumen 4", 33]]  },
    {  label: "Agents", tok: "data/cat-5", items: [["Atlas 3", 21], ["Sable 7B", 9]]  },
  ],
};
