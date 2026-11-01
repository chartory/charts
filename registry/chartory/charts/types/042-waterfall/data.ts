// 042 Waterfall · sample data (Figma chart/042-waterfall-cash-bridge, fintech: Q3 cash bridge in $M).
import type { WaterfallData } from "../../plots/waterfall";

export const data: WaterfallData = {
  max: 4,
  ticks: ["4M", "3M", "2M", "1M", "0"],
  fmt: (v) => v.toFixed(2) + "M",
  steps: [
    {  label: "OPEN", v: 1.82, total: true  },
    {  label: "SALES", v: 1.24  },
    {  label: "REFUND", v: -0.09  },
    {  label: "STAFF", v: -0.71  },
    {  label: "CLOUD", v: -0.23  },
    {  label: "TAX", v: -0.12  },
    {  label: "CLOSE", v: 1.91, total: true  },
  ],
};
