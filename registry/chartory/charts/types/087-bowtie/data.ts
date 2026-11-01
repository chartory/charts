// 087 Revenue bowtie · sample data (Figma chart/087-bowtie-revenue).
import type { BowtieData } from "../../plots/bowtie";

export const data: BowtieData = {
  fmt: (v) => String(v),
  left: [{ label: "VISITS", v: 100, text: "48K" }, { label: "TRIALS", v: 70, text: "6.2K" }, { label: "SQL", v: 45, text: "1.9K" }],
  knot: { label: "WON", v: 22, text: "420" },
  right: [{ label: "ONBOARD", v: 34, text: "$61K" }, { label: "ADOPT", v: 52, text: "$88K" }, { label: "EXPAND", v: 74, text: "$124K" }],
};
