// 071 Volume profile (Figma chart/071, "Volume at price"): C.volumeProfile, SOL / USD over two days.
import type { ChartDef } from "../../core/shell";
import { volumeProfile } from "../../plots/volume-profile";
import { data } from "./data";

const step = (data.max - data.min) / data.vol.length;
const level = (b: number) => (data.min + b * step).toFixed(1) + "–" + (data.min + (b + 1) * step).toFixed(1);
const last = data.price[data.price.length - 1];

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export const def: ChartDef = {
  no: 71,
  slug: "volume-profile",
  legend: [["data/cat-2", "Price"], ["data/primary-soft", "Value area"], ["data/primary", "Point of control · 150.5"]],
  plot: (K, p, w, d) => volumeProfile(K, p, w, (d as typeof data | undefined) ?? data),
  // two days later: the price path moves up to ±0.9 (inside the axis), volume per level up to ±15 %; the point of
  // control keeps the most volume (the legend names its level)
  update: (d, step) => {
    const o = d as typeof data;
    const vol = o.vol.map((v, b) => Math.max(1, Math.round(v * (1 + 0.15 * Math.sin(b * 1.2 + step * 2)))));
    vol[o.poc] = Math.max(vol[o.poc], ...vol.filter((_, b) => b !== o.poc).map((v) => v + 2));
    const hi = Math.max(...o.price);
    return { ...o, vol, price: o.price.map((v, i) => Math.min(hi, Math.max(o.min + 1, r3(v + 0.9 * Math.sin(i * 0.35 + step * 1.9))))) };
  },
  describe: {
    title: "SOL / USD profile",
    summary: `SOL / USD hourly price from Oct 8 to now, ${data.price[0].toFixed(2)} to ${last.toFixed(2)}; the most volume traded at ${level(data.poc)} (point of control), the value area spans ${(data.min + data.va[0] * step).toFixed(1)} to ${(data.min + (data.va[1] + 1) * step).toFixed(1)}.`,
    table: {
      head: ["Price level", "Volume", "Zone"],
      rows: data.vol.map((v, b) => [level(b), v, b === data.poc ? "Point of control" : b >= data.va[0] && b <= data.va[1] ? "Value area" : ""]).reverse(),
    },
  },
};
