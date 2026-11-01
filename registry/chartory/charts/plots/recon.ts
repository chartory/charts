// C.recon (Figma ember-chart-4.js): bank feed entries on the left, ledger entries on the right, a curve per match
// (solid green, dashed amber when the amount differs); unmatched entries read danger. Narrow entries split name and
// amount, then fall back to Label/S, then truncate the name (never the amount).
import { cell, dash, paint, place, type Kit } from "../core/kit";
import { fixTextWidth, layout, remove, type Frame, type Text } from "../core/node";

export type ReconData = { heads: [string, string]; left: string[]; right: string[]; links: [number, number, "ok" | "partial"][] };

export function recon(K: Kit, p: Frame, w: number, o: ReconData): Frame {
  const pl = K.plot(p, "reconciliation", w, K.PH);
  // narrow: a shorter link gap gives the entries room
  const cw = Math.min(170, Math.floor((w - (w < 320 ? 24 : 48)) / 2)), y0 = 20;
  const rh = Math.min(20, Math.floor((K.PH - y0) / Math.max(o.left.length, o.right.length)));
  const linked = { l: new Set(o.links.map((q) => q[0])), r: new Set(o.links.map((q) => q[1])) };
  for (const [t, x, al] of [[o.heads[0], 0, "left"], [o.heads[1], w - cw, "right"]] as const) cell(K, pl, t, x, 0, cw, "Label/Caps", "label", al);
  o.links.forEach(([l, r, kind], i) => {
    const ya = y0 + l * rh + 9, yb = y0 + r * rh + 9;
    const kc = Math.min(50, Math.round((w - 2 * cw) / 2));
    const d = "M " + cw + " " + ya + " C " + (cw + kc) + " " + ya + " " + (w - cw - kc) + " " + yb + " " + (w - cw) + " " + yb;
    const v = kind === "partial" ? dash(K, pl, "link · partial", d, "status/warning", 1.5) : K.vec(pl, "link · matched", d, { stroke: "status/success", sw: 1.5 });
    if (kind !== "partial") v.opacity = 0.7;
    v.motion = { kind: "draw", order: i, group: i, after: true };
  });
  for (const [side, list, x] of [["l", o.left, 0], ["r", o.right, w - cw]] as const)
    for (let i = 0; i < list.length; i++) {
      const un = !linked[side].has(i);
      const partial = o.links.some((q) => q[side === "l" ? 0 : 1] === i && q[2] === "partial");
      const f = K.AL(pl, (side === "l" ? "bank · " : "ledger · ") + list[i].toLowerCase(), "HORIZONTAL", { cross: "CENTER", pl: 8, pr: 8, main: side === "l" ? "MIN" : "MAX" });
      K.fixW(f, cw); K.fixH(f, 18); f.radius = 8;
      f.fill = paint(un ? "status/danger-bg" : "chipFill");
      f.stroke = paint(un ? "status/danger" : partial ? "status/warning" : "chipStroke"); f.sw = 1; f.align = "inside";
      const fg = un ? "status/danger" : "strong";
      const lt = K.caps(f, list[i], fg);
      if (lt.w > cw - 16 && list[i].includes(" · ")) {
        const [nm, amt] = list[i].split(" · ");
        remove(lt);
        K.caps(f, nm, fg); K.caps(f, amt, fg);
        f.layout = { ...f.layout!, main: "SPACE_BETWEEN", gap: 6 };
      }
      const kids = () => f.children as Text[];
      // still too wide in caps: the same words in Label/S (no caps tracking), never cut
      if (kids().length > 1 && kids().reduce((a, c) => a + c.w, 0) + 6 > cw - 16) {
        const txt = kids().map((c) => c.text);
        for (const c of [...kids()]) remove(c);
        for (const tx of txt) K.T(f, "Label/S", tx, fg);
      }
      // last resort: the first text fills the room left and truncates (layoutSizingHorizontal FILL)
      if (kids().reduce((a, c) => a + c.w, 0) + (kids().length - 1) * 6 > cw - 16) {
        const [t0, ...rest] = kids();
        fixTextWidth(t0, cw - 18 - rest.reduce((a, c) => a + c.w + 6, 0), side === "l" ? "left" : "right");
        t0.truncate = true;
      }
      layout(f);
      place(f, x, y0 + i * rh);
      f.motion = { kind: "fade", order: i, group: 100 + i };
    }
  return pl;
}
