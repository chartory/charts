// 079 Milestone track · sample data (Figma chart/079-milestones-onboarding, SaaS: share of sign-ups reaching each step).
import type { MilestonesData } from "../../plots/milestones";

export const data: MilestonesData = {
  steps: [
    { label: "Signed up", pct: 100, day: "DAY 0" }, { label: "Invited", pct: 72, day: "DAY 1" }, { label: "Connected", pct: 58, day: "DAY 2" },
    { label: "Report", pct: 44, day: "DAY 4" }, { label: "Shared", pct: 31, day: "DAY 7" }, { label: "Paid", pct: 18, day: "DAY 14" },
  ],
};
