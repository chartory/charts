// 032 Funnel · sample data (Figma chart/032, SaaS: September trial funnel, visit to annual plan).
import type { FunnelData } from "../../plots/funnel";

export const data: FunnelData = {
  widths: [1, 0.84, 0.68, 0.54, 0.42, 0.34],
  stages: [
    {  label: "Site visits", text: "48.2K", tok: "data/cat-2"  },
    {  label: "Signups", text: "12.4K", tok: "data/cat-8", conv: "26%"  },
    {  label: "Activated", text: "5.1K", tok: "data/cat-4", conv: "41%"  },
    {  label: "Paid", text: "1.2K", tok: "data/cat-10", conv: "24%"  },
    {  label: "Annual", text: "0.4K", tok: "data/cat-3", conv: "33%"  },
  ],
};
