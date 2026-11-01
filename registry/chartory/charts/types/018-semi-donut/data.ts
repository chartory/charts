// 018 Semi donut · sample data (Figma chart/018, e-commerce: orders by channel).
import type { SemiDonutData } from "../../plots/semi-donut";

export const data: SemiDonutData = {
  caps: "ORDERS",
  value: "3,412",
  items: [
    {  label: "Web", v: 118, tok: "data/cat-1"  },
    {  label: "App", v: 64, tok: "data/cat-2"  },
    {  label: "Market", v: 31, tok: "data/cat-3"  },
    {  label: "Retail", v: 15, tok: "data/cat-5"  },
  ],
};
