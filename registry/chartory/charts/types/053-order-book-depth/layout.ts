// 053 Order book depth (Figma chart/053, "Order book depth"): C.depth, cumulative BTC / USDT bids and asks around the mid.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { depth } from "../../plots/depth";
import { data } from "./data";

const usd = (v: number) => v.toLocaleString("en-US");
const lastQ = (s: [number, number][]) => s[s.length - 1][1];

/** Cumulative levels with every level's own size moved up to ±20 % (whole BTC, at least 1), kept under the axis. */
const restack = (lv: [number, number][], step: number, side: number, cap: number): [number, number][] => {
  let prev = 0, acc = 0;
  const q = lv.map(([, c], i) => { const inc = c - prev; prev = c; acc += Math.max(1, Math.round(inc * (1 + 0.2 * Math.sin(i * 1.1 + step * 1.9 + side * 2.4)))); return acc; });
  const k = q[q.length - 1] > cap ? cap / q[q.length - 1] : 1;
  return lv.map(([pr], i) => [pr, Math.max(i + 1, Math.round(q[i] * k))]);
};

// tooltip: one side of the book (group 0 bids, 1 asks): best level, the far edge and the cumulative depth
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const side = g === 0 ? "bids" : g === 1 ? "asks" : null;
  if (!side || !o[side].length) return null;
  const lv = o[side], tok = side === "bids" ? "status/success" : "status/danger";
  return {
    kind: "range",
    caps: side.toUpperCase() + " · BTC / USDT",
    rows: [
      { label: side === "bids" ? "Best bid" : "Best ask", value: usd(lv[0][0]), swatch: tok },
      { label: "Deepest", value: usd(lv[lv.length - 1][0]), swatch: tok },
      { label: "Depth", value: lastQ(lv) + " BTC", swatch: tok },
    ],
  };
};

export const def: ChartDef = {
  no: 53,
  slug: "order-book-depth",
  legend: [["status/success", "Bids"], ["status/danger", "Asks"]],
  plot: (K, p, w, d) => depth(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the book a moment later: the mid moves inside the spread (its chip follows), every level's size changes
  update: (d, step) => {
    const o = d as typeof data;
    const mid = o.mid + 10 * (((step * 3) % 5) - 2);
    return { ...o, mid, midText: "MID " + usd(mid), bids: restack(o.bids, step, 0, o.qmax - 2), asks: restack(o.asks, step, 1, o.qmax - 2) };
  },
  describe: {
    title: "Market depth",
    summary: `BTC / USDT order book within ±1% of the mid price ${usd(data.mid)}: cumulative bids reach ${lastQ(data.bids)} BTC at ${usd(data.min)}, cumulative asks ${lastQ(data.asks)} BTC at ${usd(data.max)}.`,
    table: {
      head: ["Side", "Price", "Cumulative size (BTC)"],
      rows: [...data.bids.map(([pr, q]) => ["Bid", usd(pr), q]), ...data.asks.map(([pr, q]) => ["Ask", usd(pr), q])],
    },
  },
};
