// 035 Packed bubbles · sample data (Figma chart/035, crypto: 24 h spot volume in $B per asset and its 24 h change in %).
import type { BubblesData } from "../../plots/bubbles";

const items: [string, number, number][] = [
  ["BTC", 28.4, 2.1], ["ETH", 14.1, 5.8], ["SOL", 4.2, -3.4], ["XRP", 2.9, 1.2], ["DOGE", 1.8, -6.1], ["BNB", 1.6, 0.8],
  ["ADA", 0.9, -2.2], ["AVAX", 0.7, 3.9], ["LINK", 0.6, -1.4], ["DOT", 0.5, 0.6], ["TON", 0.45, -0.9], ["ATOM", 0.4, 2.4],
];

export const data: BubblesData = { rMax: 82, items: items.map(([label, v, chg]) => ({ label, v, chg })) };
