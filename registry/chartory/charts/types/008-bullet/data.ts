// 008 Bullet · sample data (Figma chart/008-bullet, e-commerce: Q3 goals, actual against target with three ranges).
// The label column is 112 px on L (plot wider than 480), 96 px below.
import type { BulletData, BulletRow } from "../../plots/bullet";

export const rows: BulletRow[] = [
  { label: "Revenue", sub: "USD", v: 428, target: 500, max: 600, bands: [300, 450, 600], text: "$428K", ttext: "OF $500K" },
  { label: "Orders", sub: "COUNT", v: 6120, target: 7000, max: 8000, bands: [5000, 6500, 8000], text: "6,120", ttext: "OF 7,000" },
  { label: "Avg order", sub: "USD", v: 70, target: 68, max: 90, bands: [55, 70, 90], text: "$70", ttext: "OF $68" },
  { label: "Repeat buyers", sub: "SHARE", v: 31, target: 35, max: 50, bands: [20, 30, 50], text: "31%", ttext: "OF 35%" },
];
export const data = (w: number): BulletData => ({ labelW: w > 480 ? 112 : 96, rows });
