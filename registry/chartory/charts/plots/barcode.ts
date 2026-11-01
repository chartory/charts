// C.barcode (Figma ember-chart-4.js): one lane per service; seeded random events (1 px ticks) drawn by the hour
// weights, coloured by outcome (error / slow / ok at 45 %), the service name on the left and hour labels below.
import { place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type BarcodeData = {
  seed?: number; weights: number[]; xl: Record<number, string>;
  rows: {
    label: string; n: number; err: number; slow: number;
    /** given events instead of seeded ones: [hour, colour] */
    at?: [number, string][];
  }[];
  /** the hours across (default the day, 0 to 24) */
  range?: [number, number];
};

export function barcode(K: Kit, p: Frame, w: number, o: BarcodeData): Frame {
  const pl = K.plot(p, "event barcode", w, K.PH);
  const lW = 84, k = o.rows.length, rh = Math.floor((K.PH - 22) / k);
  let s = o.seed ?? 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const wm = Math.max(...o.weights), [h0, h1] = o.range ?? [0, 24];
  for (let r = 0; r < k; r++) {
    const row = o.rows[r];
    const y = r * rh + 6, h = rh - 12;
    const lb = K.T(pl, "Body/S", row.label, "strong");
    lb.name = "service · " + row.label.toLowerCase(); place(lb, 0, y + h / 2 - lb.h / 2);
    K.rect(pl, "lane · " + row.label.toLowerCase(), lW, y, w - lW, h, "chipFill", 3);
    if (row.at) {
      for (const [hr, tok] of row.at) {
        const t = (hr - h0) / (h1 - h0);
        K.rect(pl, "event", lW + 2 + Math.floor(t * (w - lW - 4)), y + 3, 1, h - 6, tok).motion = { kind: "fade", order: Math.floor(hr), group: r };
      }
      continue;
    }
    let made = 0, guard = 0;
    while (made < row.n && guard++ < row.n * 20) {
      const t = rnd();
      const hw = o.weights[Math.min(23, Math.floor(t * 24))];
      if (rnd() > hw / wm) continue;
      const q = rnd();
      const tok = q < row.err ? "status/danger" : q < row.err + row.slow ? "status/warning" : "body";
      const tk = K.rect(pl, "event", lW + 2 + Math.floor(t * (w - lW - 4)), y + 3, 1, h - 6, tok);
      if (tok === "body") tk.opacity = 0.45;
      // events fade in by hour, left to right; one hover group per lane
      tk.motion = { kind: "fade", order: Math.min(23, Math.floor(t * 24)), group: r };
      made++;
    }
  }
  for (const [hh, t] of Object.entries(o.xl)) {
    const v = +hh;
    K.xAt(pl, t, lW + Math.round(((v - h0) / (h1 - h0)) * (w - lW)), K.PH - 14, v === h0 ? "start" : v === h1 ? "end" : "center");
  }
  return pl;
}
