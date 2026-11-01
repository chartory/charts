// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 039 Network · sample data (Figma chart/039, AI: tool calls by an agent this week, in thousands).
import type { Network2Data } from "../../plots/network2";

export const data: Network2Data = {
  hub: "Atlas 3",
  hubSub: "AGENT",
  nodes: [
    { label: "Search", v: 12.4, tok: "data/cat-2", text: "12.4K", subs: [1, 1] },
    { label: "Code run", v: 8.1, tok: "data/cat-3", text: "8.1K", subs: [1, 1, 1] },
    { label: "Browser", v: 6.2, tok: "data/cat-4", text: "6.2K", subs: [1] },
    { label: "SQL", v: 5.6, tok: "data/cat-5", text: "5.6K", subs: [1, 1] },
    { label: "Email", v: 3.4, tok: "data/cat-6", text: "3.4K", subs: [1] },
    { label: "Files", v: 2.7, tok: "data/cat-8", text: "2.7K", subs: [1, 1] },
  ],
};
