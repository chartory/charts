// 058 Yard map (Figma chart/058, "Yard occupancy"): C.yard, 12 dock doors and 40 trailer slots by state.
import type { ChartDef, TooltipSpec } from "../../core/shell";
import { yard } from "../../plots/yard";
import { data } from "./data";

const names: Record<string, string> = { load: "Loading", empty: "Empty", blocked: "Blocked", loaded: "Loaded", reefer: "Reefer", wait: "Waiting 2 h+" };
const count = (xs: string[], s: string) => xs.filter((x) => x === s).length;

// tooltip: one door (groups 0 … doors − 1) or one trailer slot (after the doors): its state, swatch = its fill,
// share = how many doors / slots are in that state
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  const door = g < o.doors.length, xs = door ? o.doors : o.slots, i = door ? g : g - o.doors.length, st = xs[i];
  if (st == null) return null;
  const tok = o.toks[st] === "chipFill" ? "chip/fill" : o.toks[st];
  return { kind: "cell", caps: (door ? "DOOR " : "SLOT ") + (i + 1), value: names[st] ?? st, swatch: tok, share: count(xs, st) + " OF " + xs.length + (door ? " DOORS" : " SLOTS") };
};

export const def: ChartDef = {
  no: 58,
  slug: "yard-map",
  legend: [["data/primary", "Loading"], ["data/cat-2", "Loaded"], ["data/cat-3", "Reefer"], ["status/warning", "Waiting 2 h+"]],
  plot: (K, p, w, d) => yard(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // the yard an hour later: a few doors and slots change state (same places, same marks)
  update: (d, step) => {
    const o = d as typeof data;
    const doorNext: Record<string, string> = { load: "empty", empty: "load", blocked: "blocked" };
    const slotNext: Record<string, string> = { loaded: "wait", wait: "empty", empty: "loaded", reefer: "reefer" };
    const hit = (i: number, k: number) => (i * 7 + step * 5 + k) % 9 === 0;
    return { ...o, doors: o.doors.map((s, i) => (hit(i, 1) ? doorNext[s] : s)), slots: o.slots.map((s, i) => (hit(i, 4) ? slotNext[s] : s)) };
  },
  describe: {
    title: "Yard occupancy",
    summary: `${data.doors.length} dock doors: ${count(data.doors, "load")} loading, ${count(data.doors, "empty")} empty, ${count(data.doors, "blocked")} blocked; ${data.slots.length} yard slots: ${count(data.slots, "loaded")} loaded, ${count(data.slots, "reefer")} reefer, ${count(data.slots, "wait")} waiting over 2 h, ${count(data.slots, "empty")} empty.`,
    table: {
      head: ["Place", "State"],
      rows: [...data.doors.map((s, i) => ["Door " + (i + 1), names[s]]), ...data.slots.map((s, i) => ["Slot " + (i + 1), names[s]])],
    },
  },
};
