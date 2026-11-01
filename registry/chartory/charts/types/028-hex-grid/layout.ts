// 028 Hex grid (Figma chart/028): C.hexbin; no legend (panels are named).
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { hexbin } from "../../plots/hexbin";
import { data } from "./data";

const area = (y: number) => (y < 0.34 ? "top" : y < 0.67 ? "middle" : "bottom");
const hot = (b: [number, number, number, number][]) => [...b].sort((a, c) => c[3] - a[3])[0];

/** Tooltip for one page panel (group = the panel): its clicks, their share of all panels and where they are densest. */
function tipOf(o: typeof data, g: number): TooltipSpec | null {
  const p = o.panels[g];
  if (!p) return null;
  const all = o.panels.reduce((s, q) => s + parseFloat(q.sub), 0), v = parseFloat(p.sub);
  return { kind: "cell", caps: `${p.name.toUpperCase()} · DENSEST AT ${area(hot(p.blobs)[1]).toUpperCase()}`, value: p.sub.split(" ")[0], unit: "clicks", swatch: "data/primary", share: Math.round((v / all) * 100) + "% OF ALL CLICKS" };
}

export const def: ChartDef = {
  no: 28,
  slug: "hex-grid",
  legend: null,
  // update: next week's clicks; each page's count moves 5–15 %. The density blobs stay: any change to them moves the
  // 0.12 cut-off and adds or drops edge bins (no mark-by-mark morph), so the heat pattern reads as the same shape
  update: (d, step) => {
    const o = d as typeof data;
    return {
      ...o,
      panels: o.panels.map((p, q) => {
        const k = 1 + 0.1 * Math.sin(step * 1.7 + q * 2.1) + 0.04 * Math.sign(Math.sin(step * 1.7 + q * 2.1));
        const clicks = parseFloat(p.sub) * k;
        return { ...p, sub: clicks.toFixed(1) + "K CLICKS" };
      }),
    };
  },
  plot: (K, p, w, d) => hexbin(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tipOf(d as typeof data, g),
  describe: {
    title: "Click density by page",
    summary: `Click density this week on ${data.panels.length} pages: ${data.panels.map((p) => `${p.name} ${p.sub.split(" ")[0]}`).join(", ")} clicks; ${data.panels.map((p) => `${p.name} is densest in the ${area(hot(p.blobs)[1])}`).join(", ")}.`,
    table: { head: ["Page", "Clicks", "Densest area"], rows: data.panels.map((p) => [p.name, p.sub.split(" ")[0], area(hot(p.blobs)[1])]) },
  },
};
