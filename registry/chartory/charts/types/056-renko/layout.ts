// 056 Renko (Figma chart/056, "ETH price bricks"): C.renko, $50 bricks from $2,400, Sep 10 to Oct 9.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { renko } from "../../plots/renko";
import { data } from "./data";

const bricks = (() => {
  let pr = data.start;
  return [...data.moves].map((m, i) => { const up = m === "U"; const from = pr; pr += up ? data.size : -data.size; return [i + 1, up ? "Up" : "Down", from, pr] as [number, string, number, number]; });
})();
const ups = [...data.moves].filter((m) => m === "U").length;
const usd = (v: number) => "$" + v.toLocaleString("en-US");

// tooltip: one brick (group = brick index): its close against the brick before
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  if (g < 0 || g >= o.moves.length) return null;
  let pr = o.start;
  for (let i = 0; i < g; i++) pr += o.moves[i] === "U" ? o.size : -o.size;
  const up = o.moves[g] === "U";
  return { kind: "compare", caps: "BRICK " + (g + 1) + " · ETH", value: usd(pr + (up ? o.size : -o.size)), delta: { text: (up ? "+" : "−") + usd(o.size), tone: up ? "success" : "danger" }, comparison: "VS " + usd(pr) };
};

export const def: ChartDef = {
  no: 56,
  slug: "renko",
  legend: [["status/success", "Up $50"], ["status/danger", "Down $50"]],
  plot: (K, p, w, d) => renko(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the same brick pattern one brick higher or lower (bricks stay inside the axis)
  update: (d, step) => {
    const o = d as typeof data;
    return { ...o, start: o.start + (step % 2 ? o.size : -o.size) };
  },
  describe: {
    title: "ETH price bricks",
    summary: `ETH price in $${data.size} bricks from Sep 10 to Oct 9: ${ups} up and ${data.moves.length - ups} down bricks, from ${usd(data.start)} to ${usd(bricks[bricks.length - 1][3])}.`,
    table: { head: ["Brick", "Direction", "From", "To"], rows: bricks.map(([i, d, a, b]) => [i, d, usd(a), usd(b)]) },
  },
};
