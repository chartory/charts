// 069 Venn · sample data (Figma chart/069, accounts using dashboards, alerts and the API; region counts and set totals).
import type { VennData } from "../../plots/venn";

export const data: VennData = {
  sets: [{ label: "Dashboards", tok: "data/cat-2" }, { label: "Alerts", tok: "data/primary" }, { label: "API", tok: "data/cat-3" }],
  regions: { a: "1,240", b: "380", c: "520", ab: "610", ac: "290", bc: "140", abc: "410" },
  rows: [
    { label: "Dashboards", tok: "data/cat-2", text: "2,550", pct: "71%" },
    { label: "Alerts", tok: "data/primary", text: "1,540", pct: "43%" },
    { label: "API", tok: "data/cat-3", text: "1,360", pct: "38%" },
  ],
};
