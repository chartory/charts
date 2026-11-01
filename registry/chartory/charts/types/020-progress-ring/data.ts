// 020 Progress ring · sample data (Figma chart/020, AI: token budget, 7.2M of 10M used on day 21 of 30).
import type { PieData } from "../../plots/pie";

export const data: PieData = {
  inner: 0.84,
  track: true,
  of: 100,
  slices: [{ label: "used", v: 72, tok: "data/primary" }],
  center: { value: "72%", caps: "USED" },
  rows: [
    {  label: "Used", text: "7.2M"  },
    {  label: "Remaining", text: "2.8M"  },
    {  label: "Forecast at reset", text: "10.4M", tone: "status/warning"  },
    {  label: "Resets in", text: "9 days"  },
  ],
};
