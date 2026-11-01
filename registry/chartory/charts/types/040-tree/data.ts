// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 040 Tree · sample data (Figma chart/040, project management: release v4.2 → epics → tasks with their status).
import type { Tree2Data } from "../../plots/tree2";

export const data: Tree2Data = {
  heads: ["RELEASE", "EPICS", "TASKS"],
  levels: [
    [{ label: "v4.2 · Dec 05", status: "release" }],
    [
      { label: "Billing v3", status: "shipped", parent: 0 },
      { label: "SSO for teams", status: "in progress", parent: 0 },
      { label: "Referral v2", status: "blocked", parent: 0 },
    ],
    [
      { label: "Invoices", status: "shipped", parent: 0 },
      { label: "SAML login", status: "review", parent: 1 },
      { label: "SCIM sync", status: "todo", parent: 1 },
      { label: "Legal review", status: "blocked", parent: 2 },
    ],
  ],
};
