// 007 Horizontal bars · sample data (Figma chart/007-horizontal-bars, logistics: parcels delivered today of those
// scheduled, per hub). Values grouped by thousands (1,312).
import type { HBarsData } from "../../plots/h-bars";

const rows: [string, number, number][] = [["ROTTERDAM", 1480, 1312], ["HAMBURG", 1260, 1034], ["ANTWERP", 1120, 1046], ["LYON", 860, 598], ["MILAN", 720, 655]];

export const data: HBarsData = {
  max: 1600,
  ticks: ["0", "400", "800", "1.2K", "1.6K"],
  tokTotal: "data/seq-2",
  tokValue: "data/primary",
  rows: rows.map(([label, total, value]) => ({ label, total, value, text: String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",") })),
};
