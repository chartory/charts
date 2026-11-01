// 015 · sample data (Figma chart/015-forecast-band, fintech: cash balance in $M, actual to October, forecast with a p10–p90 band to April; band = mid ± 0.02 to today, then +0.07 per month).
import type { BandData } from "../../plots/band";

export const data: BandData = {
  mid: [2.1, 2.2, 2.15, 2.3, 2.35, 2.41, 2.46, 2.5, 2.52, 2.58, 2.6, 2.66],
  hi: [2.12, 2.22, 2.17, 2.32, 2.37, 2.43, 2.53, 2.64, 2.73, 2.8600000000000003, 2.95, 3.08],
  lo: [2.08, 2.18, 2.13, 2.28, 2.33, 2.39, 2.39, 2.36, 2.31, 2.3, 2.25, 2.24],
  split: 5,
  min: 1.8,
  max: 3.2,
  ticks: ["3.2M", "2.7M", "2.3M", "1.8M"],
  xl: { 0: "MAY", 5: "OCT", 11: "APR" },
};
