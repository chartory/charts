// 085 Correlation triangle (Figma chart/085-correlation-crypto): C.corrTri on six coins, 30-day daily returns.
import type { ChartDef } from "../../core/shell";
import { corrTri } from "../../plots/corr-tri";
import { data } from "./data";

const fmt = (r: number) => (r < 0 ? "−" : "") + Math.abs(r).toFixed(2);

/** A later 30 days: every pair drifts a little (sign kept), the tightest and loosest pairs recomputed. */
function update(d0: unknown, step: number): typeof data {
  const d = d0 as typeof data;
  let k = 0;
  const m = d.m.map((row, i) => row.map((r, j) => {
    if (i === j) return r;
    const v = +(r + 0.05 * Math.sin(k++ * 2.1 + step * 1.7 + 0.4)).toFixed(2);
    return r >= 0 ? Math.min(0.97, Math.max(0.01, v)) : Math.max(-0.97, Math.min(-0.01, v));
  }));
  const pairs = m.flatMap((row, i) => row.slice(0, i).map((r, j) => ({ r, name: d.labels[i] + " · " + d.labels[j] })));
  const hi = pairs.reduce((a, b) => (b.r > a.r ? b : a)), lo = pairs.reduce((a, b) => (Math.abs(b.r) < Math.abs(a.r) ? b : a));
  return { ...d, m, rows: [{ ...d.rows[0], text: hi.name, pct: fmt(hi.r) }, { ...d.rows[1], text: lo.name, pct: fmt(lo.r) }, d.rows[2]] };
}

export const def: ChartDef = {
  no: 85,
  slug: "correlation-triangle",
  legend: [["data/primary", "Move together"], ["data/cat-2", "Move apart"]],
  flat: ["s"],
  plot: (K, p, w, d) => corrTri(K, p, w, (d as typeof data | undefined) ?? data),
  update,
  describe: {
    title: "Asset correlation",
    summary: `Correlation of daily returns over 30 days for ${data.labels.join(", ")}: tightest ETH and BTC (0.86), loosest TON and SOL (−0.06).`,
    table: { head: ["", ...data.labels], rows: data.labels.map((l, i) => [l, ...data.labels.map((_, j) => (j <= i ? fmt(data.m[i][j]) : ""))]) },
  },
};
