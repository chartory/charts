// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 015 Forecast band (Figma chart/015-forecast-band): C.band on the cash balance (actual, forecast, p10–p90).
import type { ChartDef } from "../../core/shell";
import { band } from "../../plots/band";
import { data } from "./data";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const m = (v: number) => "$" + (Math.round(v * 100) / 100).toFixed(2) + "M";

export const def: ChartDef = {
  no: 15,
  slug: "forecast-band",
  legend: [["data/primary", "Actual"], ["data/primary-soft", "Forecast"]],
  plot: (K, p, w, d) => band(K, p, w, (d as typeof data | undefined) ?? data),
  update: (d, step) => {
    const o = d as typeof data;
    // a later run: the balance moves up to ±$0.06M on a swell plus a small upward drift; the p10–p90 band keeps its
    // width around it (clipped inside the 1.8M–3.2M axis)
    const mid = o.mid.map((v, i) => r2(v + 0.06 * Math.sin(i * 0.6 + step * 2.1) + (0.02 * step * i) / (o.mid.length - 1)));
    return {
      ...o, mid,
      hi: mid.map((m, i) => clamp(r2(m + o.hi[i] - o.mid[i]), m, o.max - 0.02)),
      lo: mid.map((m, i) => clamp(r2(m - (o.mid[i] - o.lo[i])), o.min + 0.02, m)),
    };
  },
  describe: {
    title: "Cash balance forecast",
    summary: `Cash balance from May to October (actual, ${m(data.mid[5])} today) and forecast to April: ${m(data.mid[11])}, with a p10–p90 band of ${m(data.lo[11])} to ${m(data.hi[11])}.`,
    table: { head: ["Month", "Balance", "P10", "P90", "Kind"], rows: months.map((mo, i) => [mo, m(data.mid[i]), m(data.lo[i]), m(data.hi[i]), i <= data.split ? "Actual" : "Forecast"]) },
  },
};
