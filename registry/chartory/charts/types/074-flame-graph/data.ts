// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 074 Flame graph · sample data (Figma chart/074-flame-agent-trace, AI: one agent run of 8.4 s by span and depth).
import type { FlameData } from "../../plots/flame";

export const data: FlameData = {
  total: 8.4,
  xt: [[0, "0 s"], [2, "2 s"], [4, "4 s"], [6, "6 s"], [8.4, "8.4 s"]],
  spans: [
    { label: "agent.run", d: 0, s: 0, e: 8.4, tok: "data/primary" },
    { label: "plan", d: 1, s: 0, e: 1.1, tok: "data/primary" },
    { label: "research", d: 1, s: 1.1, e: 5.6, tok: "data/cat-2" },
    { label: "answer", d: 1, s: 5.6, e: 8.4, tok: "data/primary" },
    { label: "web.search", d: 2, s: 1.2, e: 4.3, tok: "data/cat-2" },
    { label: "docs.query", d: 2, s: 4.3, e: 5.5, tok: "data/cat-3" },
    { label: "draft", d: 2, s: 5.7, e: 7.6, tok: "data/primary" },
    { label: "check", d: 2, s: 7.6, e: 8.3, tok: "data/primary" },
    { label: "fetch ×6", d: 3, s: 1.3, e: 3.4, tok: "data/cat-2" },
    { label: "queue", d: 3, s: 3.4, e: 4.2, tok: "data/cat-5" },
    { label: "rerank", d: 3, s: 4.6, e: 5.4, tok: "data/cat-3" },
    { label: "cite", d: 3, s: 6.5, e: 7.5, tok: "data/cat-3" },
    { label: "parse", d: 4, s: 1.4, e: 2.6, tok: "data/cat-2" },
  ],
};
