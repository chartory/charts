// 075 Reconciliation (Figma chart/075-recon-matching): C.recon on a day of bank feed and ledger entries.
import { buildVariant, type ChartDef, type Size, type TooltipSpec } from "../../core/shell";
import { recon } from "../../plots/recon";
import { data } from "./data";

const ok = data.links.filter((l) => l[2] === "ok").length, partial = data.links.length - ok;
const unL = data.left.filter((_, i) => !data.links.some((l) => l[0] === i));
const unR = data.right.filter((_, i) => !data.links.some((l) => l[1] === i));
const cap = (s: string) => s.split(" · ").map((x, i) => (i ? x : x.charAt(0) + x.slice(1).toLowerCase())).join(" · ");

/** What a variant draws, mark by mark: kind, text style, path commands (an entry's frame is named by its text). */
const marks = (d: unknown, s: Size, lg: boolean) =>
  buildVariant(def, s, lg, d).marks.map((m) => m.kind + "|" + (m.kind === "text" ? m.style : m.kind === "vector" ? m.d.replace(/[^MLCZ]/g, "") : "")).join("\n");
/** True when b draws the same marks as a at every size, legend on and off (narrow entries split the same way). */
const sameMarks = (a: unknown, b: unknown) => (["xs", "s", "m", "l"] as Size[]).every((s) => [true, false].every((lg) => marks(a, s, lg) === marks(b, s, lg)));

const amt = (s: string) => +(s.split(" · ")[1] ?? "").replace(/[$,]/g, "");
const usd = (v: number) => "$" + v.toLocaleString("en-US");
const nameOf = (s: string) => cap(s.split(" · ")[0]);

// tooltip: a match link (groups 0 … links − 1): the two entries it joins, and the difference when the amounts
// differ; or an entry row (group 100 + row, which the plot gives to the bank entry and the ledger entry on that row):
// both entries with their state (swatch = matched / amount differs / no match)
const tip = (o: typeof data, g: number): TooltipSpec | null => {
  if (g < 100) {
    const lk = o.links[g];
    if (!lk) return null;
    const [l, r, kind] = lk, tok = kind === "ok" ? "status/success" : "status/warning";
    const a = amt(o.left[l]), b = amt(o.right[r]);
    const rows = [{ label: "Bank · " + nameOf(o.left[l]), value: usd(a), swatch: tok }, { label: "Ledger · " + nameOf(o.right[r]), value: usd(b), swatch: tok }];
    if (a !== b) rows.push({ label: "Difference", value: (a - b > 0 ? "+" : "−") + usd(Math.abs(a - b)), swatch: tok });
    return { kind: "range", caps: kind === "ok" ? "MATCHED" : "AMOUNT DIFFERS", rows };
  }
  const i = g - 100;
  const st = (side: 0 | 1) => {
    const lk = o.links.find((q) => q[side] === i);
    return !lk ? "status/danger" : lk[2] === "ok" ? "status/success" : "status/warning";
  };
  const rows = [
    ...(o.left[i] ? [{ label: "Bank · " + nameOf(o.left[i]), value: usd(amt(o.left[i])), swatch: st(0) }] : []),
    ...(o.right[i] ? [{ label: "Ledger · " + nameOf(o.right[i]), value: usd(amt(o.right[i])), swatch: st(1) }] : []),
  ];
  return rows.length ? { kind: "range", caps: "ROW " + (i + 1), rows } : null;
};

export const def: ChartDef = {
  no: 75,
  slug: "reconciliation",
  legend: [["status/success", "Matched"], ["status/warning", "Amount differs"], ["status/danger", "No match"]],
  plot: (K, p, w, d) => recon(K, p, w, (d as typeof data | undefined) ?? data),
  tip: (d, g) => tip(d as typeof data, g),
  // later in the day: the ledger lists its entries in a new posting order, so the match curves re-route (same entries,
  // same matches); the first order from `step` on that splits narrow entries the same way at every size is taken
  update: (d, step) => {
    const o = d as typeof data, n = o.right.length;
    const at = (k: number) => ({
      ...o,
      right: o.right.map((_, j) => o.right[(j + k) % n]),
      links: o.links.map(([l, r, kind]) => [l, (r - k + n) % n, kind] as (typeof o.links)[number]),
    });
    return Array.from({ length: n - 1 }, (_, i) => at(((step + i - 1) % (n - 1)) + 1)).find((c) => sameMarks(o, c)) ?? o;
  },
  describe: {
    title: "Bank matching",
    summary: `${data.left.length} bank feed entries against ${data.right.length} ledger entries: ${ok} matched, ${partial} with a different amount, ${unL.length + unR.length} without a match.`,
    table: {
      head: ["Bank feed", "Ledger", "State"],
      rows: [
        ...data.links.map(([l, r, k]) => [cap(data.left[l]), cap(data.right[r]), k === "ok" ? "Matched" : "Amount differs"]),
        ...unL.map((t) => [cap(t), "", "No match"]),
        ...unR.map((t) => ["", cap(t), "No match"]),
      ],
    },
  },
};
