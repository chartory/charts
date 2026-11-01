// 090 Funding stripes (Figma chart/090-stripes-funding): C.stripes, 90 days of BTC perp funding with the price.
import type { ChartDef } from "../../core/shell";
import { stripes } from "../../plots/stripes";
import { data } from "./data";

const start = Date.UTC(2026, 6, 12);
const day = (i: number) => new Date(start + i * 864e5).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const neg = data.vals.filter((v) => v < 0).length;

/** A later look: funding prints move (sign kept), the price path shifts smoothly. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  return {
    ...d,
    vals: d.vals.map((v, i) => +(v * (1 + 0.18 * Math.sin(i * 0.9 + step * 1.7))).toFixed(4) || v),
    price: d.price.map((v, i) => +(v * (1 + 0.025 * Math.sin(i / 11 + step * 1.3))).toFixed(2)),
  };
}

export const def: ChartDef = {
  no: 90,
  slug: "funding-stripes",
  legend: [["data/primary", "Longs pay"], ["data/cat-2", "Shorts pay"], ["text/strong", "BTC price"]],
  plot: (K, p, w, d) => stripes(K, p, w, (d as typeof data | undefined) ?? data),
  update,
  describe: {
    title: "BTC perp funding",
    summary: `Daily funding rate (% per 8 h) over ${data.vals.length} days from ${day(0)} to ${day(data.vals.length - 1)}: longs paid on ${data.vals.length - neg} days, shorts on ${neg}; BTC price from ${data.price[0]}K to ${data.price[data.price.length - 1]}K.`,
    table: { head: ["Day", "Funding (%)", "BTC ($K)"], rows: data.vals.map((v, i) => [day(i), v, data.price[i]]) },
  },
};
