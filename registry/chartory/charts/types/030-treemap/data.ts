// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 030 Treemap · sample data (Figma chart/030, e-commerce: Q3 net sales by category and subcategory, $K).
import type { TreemapData } from "../../plots/treemap";

export const data: TreemapData = {
  fmt: (v) => "$" + v + "K",
  groups: [
    {  name: "Apparel", tok: "data/cat-1", items: [["Shirts", 84], ["Denim", 62], ["Outerwear", 41], ["Knitwear", 28], ["Socks", 12]]  },
    {  name: "Home", tok: "data/cat-2", items: [["Bedding", 58], ["Lighting", 36], ["Kitchen", 33], ["Decor", 21]]  },
    {  name: "Beauty", tok: "data/cat-3", items: [["Skincare", 47], ["Fragrance", 25], ["Haircare", 18]]  },
    {  name: "Outdoor", tok: "data/cat-5", items: [["Tents", 30], ["Footwear", 26], ["Packs", 14]]  },
  ],
};
