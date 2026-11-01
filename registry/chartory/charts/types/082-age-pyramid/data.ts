// 082 Customers by age · sample data (Figma chart/082-pyramid-customers).
import type { PyramidData } from "../../plots/pyramid";

export const data: PyramidData = {
  max: 30,
  aTok: "data/cat-2",
  bTok: "data/primary",
  rows: [{ label: "18–24", a: 14, b: 8 }, { label: "25–34", a: 28, b: 24 }, { label: "35–44", a: 24, b: 27 }, { label: "45–54", a: 17, b: 20 }, { label: "55–64", a: 11, b: 14 }, { label: "65+", a: 6, b: 7 }],
};
