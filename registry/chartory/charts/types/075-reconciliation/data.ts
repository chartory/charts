// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 075 Reconciliation · sample data (Figma chart/075-recon-matching, fintech: bank feed vs ledger, Oct 9).
import type { ReconData } from "../../plots/recon";

export const data: ReconData = {
  heads: ["BANK FEED", "LEDGER"],
  left: ["STRIPE · $12,400", "ACME CORP · $4,820", "AWS · $2,310", "PAYROLL · $48,000", "REFUND · $129", "NORDIC · $9,100", "BANK FEE · $35"],
  right: ["INV-4471 · $4,820", "STRIPE · $12,400", "PAYROLL · $48,000", "AWS SEP · $2,310", "INV-4480 · $9,000", "CREDIT · $129", "TOOLS · $640"],
  links: [[0, 1, "ok"], [1, 0, "ok"], [2, 3, "ok"], [3, 2, "ok"], [4, 5, "ok"], [5, 4, "partial"]],
};
