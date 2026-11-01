// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 073 Term cloud · sample data (Figma chart/073-term-cloud-support, SaaS: support ticket topics by weight and tone).
import type { CloudData } from "../../plots/cloud";

export const data: CloudData = {
  words: [
    ["refund", 0.62, "neg"], ["invoice", 0.4], ["login", 0.9], ["SSO", 0.5], ["export", 0.3], ["API key", 0.7],
    ["slow sync", 0.55, "neg"], ["pricing", 0.28], ["webhooks", 0.35], ["thanks", 0.45, "pos"], ["2FA", 0.2], ["seats", 0.33],
    ["dark mode", 0.22, "pos"], ["billing", 0.66], ["timeout", 0.42, "neg"], ["onboarding", 0.26, "pos"], ["Slack", 0.3], ["CSV", 0.18],
    ["rate limit", 0.38, "neg"], ["great", 0.24, "pos"],
  ],
};
