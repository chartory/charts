// C.gantt (Figma ember-chart.js): rows of jobs on an hour axis; vertical grid at the ticks (tick labels near the now
// line are dropped), row names on the left, a label inside each job that fits it, a now line with a NOW chip.
import type { Kit } from "../core/kit";
import { collection, type Frame, layout, remove } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type GanttData = {
  rows: string[]; start: number; end: number; ticks: [number, string][];
  bars: [number, number, number, string, string][]; now?: number; yW?: number;
};

export function gantt(K: Kit, p: Frame, w: number, o: GanttData): Frame {
  if (collection.signal) return signalPlot("gantt")(K, p, w, o); // Signal: charts/signal/plots/gantt.ts (@chartory/signal)
  const pl = K.plot(p, "schedule", w, K.PH);
  const yW = o.yW ?? 76, top = 22, g = 4;
  const X = (h: number) => yW + Math.round(((h - o.start) / (o.end - o.start)) * (w - yW));
  const n = o.rows.length;
  const rh = Math.floor((K.PH - top - (n - 1) * g) / n);
  for (const [h, t] of o.ticks) {
    K.rect(pl, "grid · " + t, X(h), top - 4, 1, K.PH - top + 4, "grid");
    if (o.now != null && Math.abs(X(h) - X(o.now)) < 34) continue;
    K.xAt(pl, t, X(h), 0, h === o.start ? "start" : h === o.end ? "end" : "center");
  }
  for (let r = 0; r < n; r++) {
    const t = K.T(pl, "Label/S", o.rows[r], "strong");
    t.x = 0; t.y = top + r * (rh + g) + Math.round((rh - t.h) / 2);
  }
  // reveal order: by start time, then row (jobs open left to right)
  const order = o.bars.map((_, i) => i).sort((a, b) => o.bars[a][1] - o.bars[b][1] || o.bars[a][0] - o.bars[b][0]);
  o.bars.forEach(([r, a, b, tok, label], i) => {
    const k = order.indexOf(i);
    const x = X(a) + 1, bw = X(b) - X(a) - 2, y = top + r * (rh + g);
    K.rect(pl, "job · " + label.toLowerCase(), x, y, bw, rh, tok, 4).motion = { kind: "reveal", order: k, group: i };
    const t = K.T(pl, "Label/S", label, tok === "status/warning" ? "text/inverse" : "strong");
    if (Math.ceil(t.w) + 12 <= bw) { t.x = x + 6; t.y = y + Math.round((rh - t.h) / 2); t.motion = { kind: "fade", order: k, group: i, after: true }; } else remove(t);
  });
  if (o.now != null) {
    const x = X(o.now);
    K.rect(pl, "now line", x, top - 4, 2, K.PH - top + 4, "text/strong");
    const chip = K.AL(pl, "now chip", "HORIZONTAL", { pl: 4, pr: 4, cross: "CENTER" });
    K.fixH(chip, 16); chip.fill = { tok: "surface/inverse" }; chip.radius = 3;
    K.T(chip, "Label/Caps", "NOW", "text/inverse");
    layout(chip);
    chip.x = x - Math.round(chip.w / 2) + 1; chip.y = 0;
  }
  return pl;
}
