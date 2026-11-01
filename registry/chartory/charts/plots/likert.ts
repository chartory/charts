// C.likert (Figma ember-chart-4.js): diverging stacked bars around a neutral line (the neutral share split across
// it), the question above each bar, the disagree total left of the bar and the agree total right of it.
import { place, type Kit } from "../core/kit";
import type { Frame } from "../core/node";

export type LikertData = { rows: { label: string; v: [number, number, number, number, number] }[] };

const TOKS: [string, number][] = [["status/danger", 1], ["status/danger", 0.5], ["data/track", 1], ["status/success", 0.55], ["status/success", 1]];

export function likert(K: Kit, p: Frame, w: number, o: LikertData): Frame {
  const pl = K.plot(p, "likert", w, K.PH);
  const k = o.rows.length, rh = Math.floor((K.PH - 4) / k), cx = Math.round(w / 2);
  const side = (r: LikertData["rows"][number]) => [r.v[0] + r.v[1] + r.v[2] / 2, r.v[4] + r.v[3] + r.v[2] / 2];
  const mx = Math.max(...o.rows.flatMap(side));
  const u = (cx - 44) / mx;
  K.rect(pl, "neutral line", cx, 0, 1, k * rh, "grid");
  for (let r = 0; r < k; r++) {
    const row = o.rows[r], y = r * rh;
    const lb = K.T(pl, "Body/S", row.label, "strong");
    lb.name = "question " + (r + 1); place(lb, 0, y);
    let x = cx - side(row)[0] * u;
    const by = y + 20;
    for (let j = 0; j < 5; j++) {
      const bw = row.v[j] * u;
      const s = K.rect(pl, "answer " + (j + 1), Math.round(x), by, Math.max(1, Math.round(x + bw) - Math.round(x)), 10, TOKS[j][0], 0);
      s.opacity = TOKS[j][1];
      // segments open out from the neutral line: disagree to the left, agree to the right, neutral fades
      s.motion = j < 2 ? { kind: "grow", origin: "right", order: r, group: r } : j > 2 ? { kind: "grow", origin: "left", order: r, group: r } : { kind: "fade", order: r, group: r };
      x += bw;
    }
    const dl = K.caps(pl, row.v[0] + row.v[1] + "%", "status/danger");
    place(dl, cx - side(row)[0] * u - 8 - Math.ceil(dl.w), by - 2);
    dl.motion = { kind: "fade", order: r, group: r, after: true };
    const ag = K.caps(pl, row.v[3] + row.v[4] + "%", "status/success");
    place(ag, cx + side(row)[1] * u + 8, by - 2);
    ag.motion = { kind: "fade", order: r, group: r, after: true };
  }
  return pl;
}
