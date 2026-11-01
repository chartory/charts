// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 038 Block timeline · sample data (Figma chart/038, SaaS: Q4 release train per squad; [weight, state, item, status]).
import type { BlocksData } from "../../plots/blocks";

export const data: BlocksData = {
  cols: [
    { name: "CORE", blocks: [[3, "status/success", "Billing v3", "SHIPPED"], [2, "data/cat-2", "Usage alerts", "4 DAYS LEFT"], [2, "data/track", "Audit log", "PLANNED"]] },
    { name: "GROWTH", blocks: [[2, "status/success", "Trial nudges", "SHIPPED"], [3, "data/cat-2", "Pricing page", "6 DAYS LEFT"], [2, "status/danger", "Referral v2", "BLOCKED"]] },
    { name: "PLATFORM", blocks: [[4, "data/cat-2", "SSO for teams", "9 DAYS LEFT"], [3, "data/track", "Rate limits", "PLANNED"]] },
    { name: "MOBILE", blocks: [[2, "status/danger", "Push crash", "BLOCKED"], [2, "status/success", "Offline mode", "SHIPPED"], [3, "data/track", "Widgets", "PLANNED"]] },
  ],
};
