// 085 Asset correlation · sample data (Figma chart/085-correlation-crypto).
import type { CorrTriData } from "../../plots/corr-tri";

export const data: CorrTriData = {
  labels: ["BTC", "ETH", "SOL", "XRP", "ADA", "TON"],
  m: [[1], [0.86, 1], [0.74, 0.79, 1], [0.52, 0.48, 0.41, 1], [0.63, 0.58, 0.61, 0.37, 1], [0.12, 0.08, -0.06, 0.15, -0.11, 1]],
  rows: [{ label: "Tightest", text: "ETH · BTC", pct: "0.86" }, { label: "Loosest", text: "TON · SOL", pct: "−0.06" }, { label: "Hedge", text: "TON", pct: "LOW TO BTC" }],
};
