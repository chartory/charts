// 081 Context window use · sample data (Figma chart/081-context-ruler).
import type { ContextRulerData } from "../../plots/context-ruler";

export const data: ContextRulerData = {
  max: 128,
  limit: 100,
  ticks: [0, 32, 64, 96, 128],
  kinds: [{ label: "System", tok: "data/cat-9" }, { label: "History", tok: "data/cat-2" }, { label: "Tools", tok: "data/cat-3" }, { label: "Docs", tok: "data/cat-5" }, { label: "Output", tok: "data/primary" }],
  rows: [{ label: "REQ 4812", segs: [3, 42, 12, 26, 8] }, { label: "REQ 4809", segs: [3, 18, 8, 14, 5] }, { label: "REQ 4801", segs: [3, 61, 14, 30, 9] }, { label: "REQ 4795", segs: [3, 8, 4, 40, 6] }],
};
