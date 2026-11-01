// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 091 Cluster map · sample data (Figma chart/091-clusters-tickets, SaaS: support tickets embedded and clustered, last 7 days).
import type { ClustersData } from "../../plots/clusters";

export const data: ClustersData = {
  seed: 91,
  clusters: [
    { label: "BILLING", tok: "data/cat-2", cx: 0.18, cy: 0.36, sx: 30, sy: 18, n: 22 },
    { label: "LOGIN AND SSO", tok: "data/primary", cx: 0.5, cy: 0.3, sx: 34, sy: 20, n: 26 },
    { label: "INTEGRATIONS", tok: "data/cat-3", cx: 0.82, cy: 0.4, sx: 28, sy: 18, n: 18 },
    { label: "BUGS", tok: "status/danger", cx: 0.32, cy: 0.76, sx: 26, sy: 14, n: 16 },
    { label: "FEATURE ASKS", tok: "data/cat-5", cx: 0.7, cy: 0.78, sx: 30, sy: 14, n: 12 },
  ],
};
