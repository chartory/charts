// 078 Battery cells · sample data (Figma chart/078, logistics: charge and range of 8 delivery vans).
import type { BatteriesData } from "../../plots/batteries";

export const data: BatteriesData = {
  items: [
    { label: "Van 21", v: 92, sub: "210 KM" }, { label: "Van 22", v: 18, sub: "38 KM" }, { label: "Van 23", v: 79, sub: "180 KM" },
    { label: "Van 24", v: 71, sub: "162 KM", charging: true }, { label: "Van 25", v: 95, sub: "220 KM" }, { label: "Van 26", v: 23, sub: "50 KM", charging: true },
    { label: "Van 27", v: 96, sub: "224 KM" }, { label: "Van 28", v: 94, sub: "216 KM" },
  ],
};
