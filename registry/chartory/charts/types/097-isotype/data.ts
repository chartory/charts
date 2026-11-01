// 097 Isotype · sample data (Figma chart/097, e-commerce: orders by channel this week, 1 box = 100 orders).
import type { IsotypeData } from "../../plots/isotype";

export const data: IsotypeData = {
  unit: 100,
  rows: [
    { label: "Web", v: 1840, tok: "data/cat-1" },
    { label: "App", v: 1260, tok: "data/cat-2" },
    { label: "Marketplace", v: 760, tok: "data/cat-3" },
    { label: "Retail", v: 310, tok: "data/cat-5" },
  ],
};
