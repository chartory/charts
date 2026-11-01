// C.bullet (Figma ember-chart.js): bullet rows: a label with its unit, three qualitative bands, the actual bar, a
// target tick, and the value with its target on the right.
import type { Kit } from "../core/kit";
import { collection, type Frame } from "../core/node";
import { signalPlot } from "../core/signal-hook";

export type BulletRow = { label: string; sub: string; v: number; target: number; max: number; bands: number[]; text: string; ttext: string };
export type BulletData = { rows: BulletRow[]; labelW?: number; valueW?: number };

export function bullet(K: Kit, p: Frame, w: number, o: BulletData): Frame {
  if (collection.signal) return signalPlot("bullet")(K, p, w, o); // Signal: charts/signal/plots/bullet.ts (@chartory/signal)
  const pl = K.plot(p, "bullets", w, K.PH);
  const lw = o.labelW ?? 112, vw = o.valueW ?? 56, bx = lw + 12, bw = w - bx - vw - 12;
  const n = o.rows.length, rh = 38, gap = Math.floor((K.PH - n * rh) / (n - 1));
  const bandTok = ["data/hatch", "data/track", "data/idle"];
  for (let i = 0; i < n; i++) {
    const r = o.rows[i], y = i * (rh + gap), nm = r.label.toLowerCase();
    const X = (v: number) => Math.round((Math.min(v, r.max) / r.max) * bw);
    const t = K.T(pl, "Body/S", r.label, "strong"); t.x = 0; t.y = y;
    const s = K.caps(pl, r.sub); s.x = 0; s.y = y + 20;
    let prev = 0;
    r.bands.forEach((b, k) => {
      const x1 = X(b);
      K.rect(pl, "band " + (k + 1) + " · " + nm, bx + prev, y + 8, x1 - prev, 20, bandTok[k], k === 0 ? [4, 0, 0, 4] : k === r.bands.length - 1 ? [0, 4, 4, 0] : 0)
        .motion = { kind: "fade", order: i, group: i };
      prev = x1;
    });
    // the actual bar opens from the left edge (a wipe; no horizontal grow origin yet), the target tick pops after it
    K.rect(pl, "actual · " + nm, bx, y + 14, X(r.v), 8, "data/primary", 2).motion = { kind: "reveal", order: i, group: i, after: true };
    K.rect(pl, "target · " + nm, bx + X(r.target) - 1, y + 4, 3, 28, "text/strong", 1).motion = { kind: "pop", order: i, group: i, after: true };
    const v = K.T(pl, "Label/S", r.text, "strong");
    v.name = "value · " + nm; v.x = w - Math.ceil(v.w); v.y = y + 2;
    v.motion = { kind: "fade", order: i, group: i, after: true };
    const tg = K.caps(pl, r.ttext);
    tg.name = "target value · " + nm; tg.x = w - Math.ceil(tg.w); tg.y = y + 20;
    tg.motion = { kind: "fade", order: i, group: i, after: true };
  }
  return pl;
}
