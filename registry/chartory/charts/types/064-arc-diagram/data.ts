// 064 Arc diagram · sample data (Figma chart/064, transfers between wallet clusters; link value = transfer weight).
import type { ArcDiagramData } from "../../plots/arc-diagram";

export const data: ArcDiagramData = {
  nodes: [
    { label: "CEX", v: 9, tok: "data/cat-2" }, { label: "MM", v: 6, tok: "data/cat-3" }, { label: "DEFI", v: 7, tok: "data/primary" },
    { label: "BRIDGE", v: 4, tok: "data/cat-4" }, { label: "WHALE", v: 5, tok: "data/cat-5" }, { label: "RETAIL", v: 8, tok: "data/cat-8" },
    { label: "MINER", v: 3, tok: "data/cat-6" },
  ],
  links: [[0, 5, 9], [0, 1, 7], [1, 2, 6], [2, 3, 4], [4, 0, 8], [5, 2, 3], [6, 0, 5], [3, 5, 2], [1, 4, 3], [2, 6, 1]],
};
