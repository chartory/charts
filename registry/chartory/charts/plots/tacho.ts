// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// C.tacho (Figma ember-chart-5.js, type 92): a 24 h tachograph disc. A face, one ring band per driver (track, then the
// day's activity segments as arcs from midnight at 12 o'clock), hour labels every 6 h outside, a centred caption and
// the side list (C.sideList).
import { arc, ctr, P, place, type Kit, type Row } from "../core/kit";
import type { Frame } from "../core/node";
import type { StyleName } from "../core/text";

export type TachoData = {
  kinds: Record<string, string>;
  center: [StyleName, string, string][];
  drivers: { label: string; segs: [number, number, string][] }[];
  rows: Row[];
};

export function tacho(K: Kit, p: Frame, w: number, o: TachoData): Frame {
  const pl = K.plot(p, "tachograph", w, K.PH);
  const R = Math.floor((K.PH - 12) / 2) - 12, cx = 20 + R, cy = Math.floor(K.PH / 2), band = Math.floor((R * 0.62) / o.drivers.length);
  // a full disc: Figma keeps no arc data on it, so it is a plain ellipse
  delete arc(K, pl, "face", cx, cy, R + 2, 0, 0, 2 * Math.PI, "chipFill").arc;
  // arcs sweep from 12 o'clock: no sweep kind yet, so the segments fade in order around the disc, driver by driver
  let k = 0;
  o.drivers.forEach((d, i) => {
    const rout = R - i * band, rin = rout - band + 3;
    arc(K, pl, "track · " + d.label.toLowerCase(), cx, cy, rout, rin / rout, 0, 2 * Math.PI, "data/track");
    for (const [a, b, kind] of d.segs) {
      const e = arc(K, pl, kind + " · " + d.label.toLowerCase(), cx, cy, rout, rin / rout, -Math.PI / 2 + (a / 24) * 2 * Math.PI, -Math.PI / 2 + (b / 24) * 2 * Math.PI, o.kinds[kind]);
      e.motion = { kind: "sweep", order: k++, group: i };
    }
  });
  for (let h = 0; h < 24; h += 6) {
    const [x, y] = P(cx, cy, R + 10, -Math.PI / 2 + (h / 12) * Math.PI);
    const t = K.caps(pl, String(h).padStart(2, "0"), "axis");
    place(t, x - Math.ceil(t.w) / 2, y - 7);
  }
  const c = ctr(K, pl, "centre", o.center, 0);
  place(c, cx - c.w / 2, cy - c.h / 2);
  K.sideList(pl, cx + R + 28, w - (cx + R + 28), o.rows);
  return pl;
}
