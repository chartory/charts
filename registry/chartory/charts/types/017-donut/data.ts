// 017 Donut · sample data (Figma chart/017, SaaS: MRR by plan in $K, September; $184K in all).
import type { PieData } from "../../plots/pie";

const sl: [string, number, string][] = [["Enterprise", 82, "data/cat-1"], ["Business", 54, "data/cat-2"], ["Team", 31, "data/cat-3"], ["Starter", 17, "data/cat-4"]];
export const data: PieData = {
  slices: sl.map(([label, v, tok]) => ({ label, v, tok })),
  rows: sl.map(([label, v, tok]) => ({ label, tok, text: "$" + v + "K", pct: Math.round((v / 184) * 100) + "%" })),
};
