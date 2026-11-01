// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.orbits2 (Figma ember-chart-2.js, type 41): tiers as dotted orbits (dashed guide, n dots evenly from 12 o'clock;
// the active share solid, the rest at 22 %), an active-share ring in the middle with its value, and the side list
// (C.sideList) with each tier's count and active share.
import { arc, paint, type Kit } from "../core/kit";
import { ellipse, layout, type Frame } from "../core/node";

export type Orbits2Data = { active: number; rings: { label: string; n: number; size: number; active: number; tok: string; text: string }[] };

export function orbits2(K: Kit, p: Frame, w: number, o: Orbits2Data): Frame {
  const pl = K.plot(p, "orbit tiers", w, K.PH);
  const R = Math.floor((K.PH - 4) / 2), cx = 2 + R, cy = Math.floor(K.PH / 2);
  const T = o.rings.length;
  o.rings.forEach((rg, i) => {
    const r = Math.round(R * (0.5 + (0.5 * (i + 1)) / T)) - Math.ceil(rg.size / 2);
    // Figma: createEllipse, stroke inside, dashPattern [1, 3]. The node model has no dash on ellipses yet: set it as a
    // property the diff reads (the renderer draws ellipse strokes solid until it reads `dash` too).
    const g = ellipse(pl, "tier guide · " + rg.label.toLowerCase(), cx - r, cy - r, 2 * r, 2 * r, { stroke: paint("grid"), sw: 1, align: "inside" });
    Object.assign(g, { dash: [1, 3] });
    const act = Math.round((rg.n * rg.active) / 100);
    // dots pop tier by tier, clockwise from 12 o'clock
    for (let k = 0; k < rg.n; k++) {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / rg.n;
      const d = rg.size;
      const dt = K.dot(pl, d, rg.tok, k < act ? "active" : "idle");
      dt.x = Math.round(cx + Math.cos(a) * r - d / 2); dt.y = Math.round(cy + Math.sin(a) * r - d / 2);
      if (k >= act) dt.opacity = 0.22;
      dt.motion = { kind: "pop", order: i + k / rg.n, group: i };
    }
  });
  const rr = Math.round(R * 0.36);
  arc(K, pl, "active track", cx, cy, rr, 0.86, 0, 2 * Math.PI, "data/track");
  // the active arc sweeps from 12 o'clock (fade until a sweep kind exists)
  arc(K, pl, "active arc", cx, cy, rr, 0.86, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * o.active) / 100, "data/primary").motion = { kind: "sweep", order: T };
  const c = K.AL(pl, "centre", "VERTICAL", { cross: "CENTER", gap: 1 });
  K.T(c, "Body/L", o.active + "%", "strong"); K.caps(c, "ACTIVE");
  layout(c);
  c.x = cx - Math.round(c.w / 2); c.y = cy - Math.round(c.h / 2);
  for (const t of c.children) t.motion = { kind: "fade", order: T, after: true };
  K.sideList(pl, cx + R + 28, w - (cx + R + 28), o.rings.map((r) => ({ label: r.label, tok: r.tok, text: r.text, pct: r.active + "%" })));
  return pl;
}
