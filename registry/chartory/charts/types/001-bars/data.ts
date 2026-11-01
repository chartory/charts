// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 001 Bars · sample data (Figma chart/001-bars, fintech: monthly card spend in $K; the open month highlighted).
import type { VBarsData } from "../../plots/vbars";

const track = "data/track";
export const data: VBarsData = {
  cats: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"],
  vals: [48, 52, 61, 57, 66, 59, 71, 68, 40],
  toks: [track, track, track, track, track, track, track, track, "data/primary"],
  max: 80,
  shape: "top",
  inside: "flat",
  ratio: 0.25,
  fmt: (x) => x + "K",
};
