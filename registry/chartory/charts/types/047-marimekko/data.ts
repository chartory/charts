// 047 Marimekko · sample data (Figma chart/047, e-commerce: Q3 net sales by region (share) and category (parts)).
import type { MarimekkoData } from "../../plots/marimekko";

export const data: MarimekkoData = {
  toks: ["data/cat-1", "data/cat-2", "data/cat-3", "data/cat-5"],
  cols: [
    { label: "NA", share: 38, parts: [34, 22, 28, 16] },
    { label: "EU", share: 30, parts: [41, 25, 18, 16] },
    { label: "APAC", share: 20, parts: [22, 14, 46, 18] },
    { label: "LATAM", share: 12, parts: [38, 30, 12, 20] },
  ],
};
