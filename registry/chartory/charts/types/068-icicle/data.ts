// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 068 Icicle · sample data (Figma chart/068, inference spend this month by team and project, $K).
import type { IcicleData } from "../../plots/icicle";

export const data: IcicleData = {
  root: "All teams",
  fmt: (v) => "$" + v + "K",
  teams: [
    { label: "Support", v: 18.4, tok: "data/cat-2", kids: [{ label: "Chat bot", v: 11.2 }, { label: "Triage", v: 7.2 }] },
    { label: "Search", v: 12.1, tok: "data/cat-3", kids: [{ label: "Rerank", v: 7.5 }, { label: "Embed", v: 4.6 }] },
    { label: "Agents", v: 10.6, tok: "data/primary", kids: [{ label: "Ops", v: 6.4 }, { label: "Sales", v: 4.2 }] },
    { label: "Labs", v: 7.1, tok: "data/cat-5", kids: [{ label: "Evals", v: 7.1 }] },
  ],
};
