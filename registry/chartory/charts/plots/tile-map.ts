// C.tileMap (Figma ember-chart-2.js, type 29): a square-tile map (one tile per region at its grid column / row, on the
// sequential ramp, code centred on it) and the side list (C.sideList). The tile size leaves the list room for every
// row on one line (C.listNeed).
import { width, type Kit, type Row } from "../core/kit";
import { fixTextWidth, type Frame } from "../core/node";

export type TileMapData = { tiles: [string, number, number, number][]; rows: Row[] };

/** Width the side list needs to keep every row on one line (C.listNeed, ember-chart.js). */
const listNeed = (rows: Row[]) => Math.max(0, ...rows.map((r) => (r.tok ? 16 : 0) + Math.ceil(width(r.label, "Body/S")) + 12 + Math.ceil(width(r.text ?? "", "Body/S"))));

export function tileMap(K: Kit, p: Frame, w: number, o: TileMapData): Frame {
  const pl = K.plot(p, "tile map", w, K.PH);
  const cols = Math.max(...o.tiles.map((t) => t[1])) + 1, rows = Math.max(...o.tiles.map((t) => t[2])) + 1;
  const need = listNeed(o.rows);
  const s = Math.floor(Math.min((w - Math.max(140, need + 24)) / cols, K.PH / rows)), g = 3;
  const x0 = 0;
  // tiles fade in reading order (row by row, left to right)
  const order = [...o.tiles].sort((a, b) => a[2] - b[2] || a[1] - b[1]).map((t) => t[0]);
  o.tiles.forEach(([code, cx, cy, v], i) => {
    const r = K.rect(pl, "tile · " + code.toLowerCase(), x0 + cx * s, cy * s, s - g, s - g, v === 0 ? "data/idle" : "data/seq-" + v, 4);
    r.motion = { kind: "fade", order: order.indexOf(code), group: i };
    const t = K.caps(pl, code, v >= 4 ? "strong" : "body");
    fixTextWidth(t, s - g, "center"); t.x = x0 + cx * s; t.y = cy * s + Math.round((s - g - 14) / 2);
    t.motion = { kind: "fade", order: order.indexOf(code), group: i, after: true };
  });
  const lx = cols * s + 24;
  K.sideList(pl, lx, w - lx, o.rows);
  return pl;
}
