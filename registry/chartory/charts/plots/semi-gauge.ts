// C.semiGauge (Figma ember-chart-2.js, type 21): a half-ring gauge from 9 o'clock to 3 o'clock: a track, the normal
// zone up to the warning mark and the overload zone after it, a needle with its hub, the 0 % / warning / 100 % marks
// outside the ring and the value block under the hub.
import { arc, type Kit } from "../core/kit";
import { fixTextWidth, layout, type Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type SemiGaugeData = { v: number; warn: number; center?: string; caps: string };

export function semiGauge(K: Kit, p: Frame, w: number, o: SemiGaugeData): Frame {
  const pl = K.plot(p, "semi gauge", w, K.PH);
  const R = Math.min(Math.floor(w / 2) - 8, K.PH - 84), cx = Math.round(w / 2), cy = 12 + R;
  const f = (v: number) => Math.PI + (Math.PI * v) / 100;
  arc(K, pl, "track", cx, cy, R, 0.8, Math.PI, 2 * Math.PI, "data/track");
  // zones sweep from 9 o'clock (fade in order until a sweep kind exists)
  arc(K, pl, "zone · normal", cx, cy, R, 0.8, f(0), f(o.warn) - 0.02, "data/primary").motion = { kind: "sweep", order: 0 };
  arc(K, pl, "zone · overload", cx, cy, R, 0.8, f(o.warn) + 0.02, f(100), "status/warning", 0.85).motion = { kind: "sweep", order: 1 };
  const ang = f(o.v), L = R - 30;
  const nx = +(cx + Math.cos(ang) * L).toFixed(2), ny = +(cy + Math.sin(ang) * L).toFixed(2);
  K.vec(pl, "needle", "M " + cx + " " + cy + " L " + nx + " " + ny, { stroke: "text/strong", sw: 3 }).motion = { kind: "draw", order: 2, group: 0 };
  const hub = K.dot(pl, 14, "text/strong", "hub"); hub.x = cx - 7; hub.y = cy - 7;
  hub.motion = { kind: "pop", order: 2, group: 0 };
  for (const [v, t] of [[0, "0%"], [o.warn, o.warn + "%"], [100, "100%"]] as [number, string][]) {
    const a2 = f(v);
    const tt = K.caps(pl, t, "axis");
    tt.x = Math.round(cx + Math.cos(a2) * (R + 6) - (v === 0 ? Math.ceil(tt.w) : v === 100 ? 0 : tt.w / 2));
    tt.y = Math.round(cy + Math.sin(a2) * (R + 10) - (v === o.warn ? 14 : 0));
    if (v === o.warn) { tt.x = Math.round(cx + Math.cos(a2) * (R + 10)); tt.y = Math.round(cy + Math.sin(a2) * (R + 10) - 16); }
  }
  const c = K.AL(pl, "value", "VERTICAL", { cross: "CENTER" });
  for (const [st, tx, tk] of [["Display/M", o.center ?? o.v + "%", "strong"], ["Label/Caps", o.caps, "label"]] as [StyleName, string, string][]) {
    const t = K.T(c, st, tx, tk); const tw = Math.ceil(t.w); fixTextWidth(t, tw % 2 ? tw + 1 : tw, "center");
  }
  layout(c);
  c.x = cx - Math.round(c.w / 2); c.y = cy + 12;
  for (const t of c.children) t.motion = { kind: "fade", order: 3, group: 0, after: true };
  return pl;
}
