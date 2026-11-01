// Data states for the update and live motion (brief §4), built on the server: `vary` moves a type's sample values
// (deterministic, seeded) so the same marks can morph from old data to new; `tickSeries` shifts a series by one point
// (a new value arrives at the end, the oldest leaves). Layout never runs in the browser: every state is rendered as
// SVG on the server and the client only swaps and morphs.

/** Seeded pseudo-random in [0, 1). */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

const VALUE_ARRAYS = new Set(["vals", "values", "vol", "volume", "series"]);
const VALUE_KEYS = new Set(["v", "value", "total", "val"]);
const KEEP = new Set(["max", "min", "ticks", "ranks", "k", "size", "steps"]);

/** Sample data with its values moved by up to ±15 % (clamped to the data's own max), every other field kept. */
export function vary<T>(data: T, seed: number): T {
  const r = rng(seed);
  const walk = (x: unknown, max: number | undefined): unknown => {
    if (Array.isArray(x)) return x.map((v) => walk(v, max));
    if (x && typeof x === "object") {
      const o = x as Record<string, unknown>;
      const m = typeof o.max === "number" ? o.max : max;
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(o)) {
        if (KEEP.has(k) || typeof v === "function") out[k] = v;
        else if (VALUE_ARRAYS.has(k) && Array.isArray(v) && v.every((n) => typeof n === "number"))
          out[k] = v.map((n: number) => clamp(n * (0.85 + 0.3 * r()), m));
        else if (VALUE_KEYS.has(k) && typeof v === "number") out[k] = clamp(v * (0.85 + 0.3 * r()), m);
        else out[k] = walk(v, m);
      }
      return out;
    }
    return x;
  };
  return walk(data, undefined) as T;
}
const clamp = (v: number, max: number | undefined) => (max != null && v > max ? max : v);

/** A numeric series one step on: the oldest value leaves, a new one (a seeded random walk) arrives, kept in [min, max]. */
export function tickSeries(vals: number[], seed: number, min: number, max: number): number[] {
  const r = rng(seed);
  const last = vals[vals.length - 1];
  const step = (max - min) * 0.04 * (r() * 2 - 1);
  return [...vals.slice(1), Math.max(min, Math.min(max, last + step))];
}
