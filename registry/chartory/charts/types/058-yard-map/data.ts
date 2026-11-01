// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 058 Yard occupancy · sample data (Figma chart/058, from the Figma definition, seeded values expanded).
import type { YardData } from "../../plots/yard";

export const data: YardData = {
  toks: { load: "data/primary", empty: "chipFill", blocked: "status/danger", loaded: "data/cat-2", reefer: "data/cat-3", wait: "status/warning" },
  doors: ["load", "load", "empty", "load", "blocked", "load", "empty", "load", "load", "empty", "load", "load"],
  slots: ["loaded", "loaded", "reefer", "wait", "loaded", "empty", "loaded", "reefer", "loaded", "loaded", "reefer", "loaded", "empty", "loaded", "wait", "loaded", "loaded", "empty", "reefer", "loaded", "loaded", "empty", "loaded", "loaded", "wait", "reefer", "empty", "loaded", "loaded", "wait", "loaded", "empty", "loaded", "reefer", "empty", "loaded", "empty", "loaded", "empty", "loaded"]
};
