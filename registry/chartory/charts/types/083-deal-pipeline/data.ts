// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 083 Deal pipeline · sample data (Figma chart/083-pipeline-deals).
import type { PipelineData } from "../../plots/pipeline";

export const data: PipelineData = {
  fmt: (v) => "$" + v + "K",
  stages: [{ label: "LEAD", deals: [[24, 5], [18, 12], [30, 8], [12, 30], [20, 3], [16, 50]] }, { label: "QUALIFIED", deals: [[40, 10], [22, 25], [35, 6], [18, 48]] }, { label: "DEMO", deals: [[60, 14], [28, 22], [45, 9]] }, { label: "PROPOSAL", deals: [[85, 18], [40, 33]] }, { label: "WON", deals: [[70, 2], [52, 4]] }],
};
