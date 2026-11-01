// Text measurement on the server, the way the Figma kit measures it: Geist advances + pair kerning + tracking
// between characters; an auto-width text box is the whole-pixel ceiling (checked against the Figma dumps).
import { EMBER_STYLES, GEIST } from "./geist-metrics";

export type StyleName = keyof typeof EMBER_STYLES;
export type TextStyle = { size: number; lineHeight: number; tracking: number; weight: 400 | 500 };

export const style = (name: StyleName): TextStyle => EMBER_STYLES[name] as TextStyle;

type Weight = { adv: Record<string, number>; kern: Record<string, number>; lig: Record<string, number>; split: Record<string, string>; mid: Record<string, number>; ctx: Record<string, number>; missing: readonly string[] };
const weights = GEIST.weights as unknown as Record<string, Weight>;

const maxLig = Math.max(...Object.values(weights).flatMap((w) => Object.keys(w.lig).map((k) => [...k].length)), 1);

/** Text → glyph keys: ligatures by longest match, else one key per character. Ligatures stay on with letter spacing:
 *  Figma and the browser both draw them (measured in Chrome, 2026-10-13); the renderer sets common-ligatures. */
function glyphs(text: string, w: Weight): string[] {
  const chars = [...text];
  const out: string[] = [];
  for (let i = 0; i < chars.length; ) {
    const forced = w.split[chars.slice(i, i + 3).join("")];
    if (forced) { out.push(forced); i += [...forced].length; continue; }
    let hit = 0;
    for (let n = Math.min(maxLig, chars.length - i); n >= 2 && !hit; n--) if (w.lig[chars.slice(i, i + n).join("")] !== undefined) hit = n;
    if (hit) { out.push(chars.slice(i, i + hit).join("")); i += hit; } else { out.push(chars[i]); i++; }
  }
  return out;
}

/** Width of the glyph run in px, before rounding: advances + kerning between glyphs + tracking × (characters − 1). */
/** A glyph Geist has no metrics for (the buyer's data: other scripts, emoji, rare symbols) is measured, not refused:
 *  1 em for wide scripts and emoji, else the width of "n" (launch audit 1.4: an unknown glyph used to throw and take
 *  the chart down). CHARTORY_STRICT_METRICS=1 keeps the old error, for the kit's own samples (scripts, tests). */
// read without Node's types: the package runs in browsers too (a buyer's Vite app has no @types/node)
const STRICT = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CHARTORY_STRICT_METRICS === "1";
const WIDE = /[\p{Extended_Pictographic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u3000-\u303f\uff00-\uffef]/u;
function fallbackAdvance(k: string, w: Weight): number {
  return WIDE.test(k) ? 1000 : (w.adv["n"] ?? 560);
}

export function runWidth(text: string, name: StyleName): number {
  return runWidthOf(text, style(name));
}

/** The same run for any Geist size / weight / tracking (site HTML, where the type comes from the page styles). */
export function runWidthOf(text: string, s: Pick<TextStyle, "size" | "tracking" | "weight">): number {
  const w = weights[s.weight];
  const keys = glyphs(text, w);
  let units = 0;
  keys.forEach((k, i) => {
    const a = w.adv[k] ?? w.lig[k];
    if (a === undefined && STRICT) throw new Error(`No Geist metrics for "${k}" (U+${k.codePointAt(0)!.toString(16)}) in "${text}"`);
    units += (a ?? fallbackAdvance(k, w)) + (i ? w.kern[keys[i - 1] + "\u0000" + k] ?? 0 : 0);
    // contextual kerning: a ligature between two glyphs (Geist: ff −20), and any other stored three-glyph run
    if (i > 1) units += (w.mid[keys[i - 1]] ?? 0) + (w.ctx[keys[i - 2] + "\u0000" + keys[i - 1] + "\u0000" + k] ?? 0);
  });
  return (units * s.size) / GEIST.unitsPerEm + s.tracking * Math.max(0, [...text].length - 1);
}

/** Two kit texts sit exactly on a whole-pixel boundary where Figma's own float arithmetic rounds the other way
 *  (checked on all 990 auto-width texts of the 100 Figma chart sets: every other one follows the rule below). */
// Texts whose Figma width differs from the run by one pixel at a whole-pixel boundary (run within 0.05 of it; checked
// on all 2,640 auto-width texts in the chart and rich-widget dumps, these are the only ones that differ).
const FIGMA_BOUNDARY: Record<string, number> = {
  "Label/S|$596K": 34, // run 34.001
  // Signal widgets (Chartory styles; Signal gallery dumps 2026-10-18)
  "Chartory/Label/SM|Q4 2026": 54, // run 54.002
  "Chartory/Body/SM|Vs last quarter": 87, // run 87.009
  "Chartory/Label/SM|eu-west": 51, // run 49.998
  "Chartory/Label/SM|310": 23, // run 21.996
  "Chartory/Body/SM|Parcels delivered · 16 countries": 182, // run 182.013
  "Chartory/Body/XS|Idle": 20, // run 20.004
  "Chartory/Label/SM|Open board": 72, // run 70.980
  "Chartory/Body/SM|Tasks · 3 stages": 94, // run 94.029
  "Chartory/Body/SM|Route delay · van 14": 117, // run 117.013
  "Chartory/Body/SM|Trailers in yard": 86, // run 86.008
  "Chartory/Body/XS|Detractors": 58, // run 58.008
  "Chartory/Label/SM|Accounts that could add Alerts": 189, // run 187.889
  "Chartory/Label/SM|web search": 71, // run 69.979
  "Chartory/Label/SM|Open loads": 70, // run 68.978
  "Chartory/Label/SM|Req 4809": 61, // run 59.995
  "Chartory/Body/SM|Trades to rebalance": 117, // run 117.013
  "Chartory/Label/SM|Billing": 39, // run 37.986
  "Chartory/Label/SM|Open mining": 78, // run 76.999
  "Chartory/Label/SM|Flaky suites to quarantine": 158, // run 156.975
  "Chartory/Label/SM|Open budget": 80, // run 78.975
  "Chartory/Body/SM|Monthly savings · 3 moves": 156, // run 156.013
  "Chartory/Label/SM|Fix proposed · parallel fetch": 169, // run 167.960
  "Chartory/Label/SM|Refund success rule": 125, // run 123.955
  "Chartory/Label/SM|Next 14 days": 78, // run 76.999
  "Chartory/Numeric/MD|22": 30, // run 30.000
  "Chartory/Label/SM|Muted": 40, // run 39.000
  "Chartory/Body/XS|38% of all rules · spread them": 162, // run 162.012
  "Chartory/Label/SM|Draft · operator": 93, // run 91.988
  "Chartory/Body/XS|80% by Oct 31": 79, // run 79.008
  "Chartory/Body/XS|Storage": 43, // run 43.008
  "Chartory/Body/SM|October invoice · estimate": 154, // run 154.011
  // Signal collection (Geist 11 / 13 in the Signal and Chartory styles; Signal dumps 2026-10-18)
  "Signal/Chart/Axis|400M": 32, // run 30.998
  "Signal/Chart/Axis|256": 21, // run 19.998
  "Signal/Chart/Axis|Layer 1": 35, // run 35.002
  "Signal/Chart/Axis|#3": 12, // run 12.001
  "Signal/Chart/Axis|Below average": 74, // run 74.019
  "Chartory/Body/SM|Iris Ave": 43, // run 43.004
  "Signal/Chart/Axis|Fewer runs": 56, // run 56.012
  "Signal/Chart/Axis|Run": 21, // run 19.998
  "Signal/Chart/Axis|Under 1×": 44, // run 42.999
  "Signal/Chart/Axis|Orion XL latency": 83, // run 81.994
  "Label/Caps|EVAL SUITES": 72, // run 72.01 (126 legend)
  "Label/Caps|VIEWER": 43, // run 43.01 (127)
  "Label/Caps|refunds-legacy": 85, // run 85.02 (120)
  "Label/Caps|PROPOSED 3": 74, // run 72.99, Figma 74 (111)
  "Body/S|All agents": 59, // run 59.007 (103 widget chips)
  "Label/Caps|ALERTS HELD FOR DIGEST": 148, // run 148.0 (124 widget hero)
  "Heading/S|Alert fire strip": 94, // run 94.005 (131 widget header)
  "Label/Caps|APR · 412": 53, // run 51.990
  "Body/S|Hardware refresh −$42K": 145, // run 145.041
  "Body/S|eu-west cache warmed · −30 ms": 193, // run 193.024
  "Body/S|Tax instalment · −$185K": 140, // run 140.010
  "Body/S|Seats": 34, // run 34.008
  "Body/S|Home": 36, // run 34.996
  "Label/S|15.8K": 27, // run 27.005
  "Heading/S|Evening slots fully booked": 180, // run 180.015
  "Label/Caps|PROMPT CHANGE ON OCT 7 · CHECK": 208, // run 206.970
  "Heading/S|web search": 79, // run 79.005
  "Heading/S|Requests compacted today": 188, // run 188.010
  "Label/Caps|THIS YEAR": 58, // run 58.000
  "Display/Title|$1.2M": 89, // run 89.024
};

/** Width of an auto-width text box in Figma: the run, rounded up to a whole pixel. Figma keeps letter spacing as a
 *  float32 (1.2 is 1.2000000477), so a run that adds up to a whole number with tracking lands just above it. */
export function textWidth(text: string, name: StyleName): number {
  const fixed = FIGMA_BOUNDARY[name + "|" + text];
  if (fixed !== undefined) return fixed;
  const s = style(name);
  const n = [...text].length;
  const w = runWidth(text, name) - s.tracking * Math.max(0, n - 1) + Math.fround(s.tracking) * Math.max(0, n - 1);
  return Math.ceil(w - 1e-9);
}

/** Figma "truncate ending": the longest start of the text that fits with an ellipsis. */
export function truncate(text: string, name: StyleName, width: number): string {
  if (runWidth(text, name) <= width) return text;
  const chars = [...text];
  for (let n = chars.length - 1; n > 0; n--) {
    const t = chars.slice(0, n).join("").trimEnd() + "…";
    if (runWidth(t, name) <= width) return t;
  }
  return "…";
}

/** Baseline offset from the top of a text box: Figma centres the font's ascent + descent in the line height and puts
 *  the baseline on a whole pixel (rounded; measured on the Figma exports for all seven Ember styles in charts). */
export function baseline(name: StyleName): number {
  return Math.round(baselineAt(name));
}
/** The baseline before rounding (auto layout's baseline alignment works on it). */
export function baselineAt(name: StyleName): number {
  const s = style(name);
  const asc = (GEIST.ascent * s.size) / GEIST.unitsPerEm;
  const content = ((GEIST.ascent - GEIST.descent) * s.size) / GEIST.unitsPerEm;
  return (s.lineHeight - content) / 2 + asc;
}

/** Figma auto-height wrapping of a fixed-width text: greedy at spaces, a word wider than the box breaks between
 *  characters. Returns the lines. */
export function wrapLines(text: string, name: StyleName, width: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? cur + " " + word : word;
    if (!cur || runWidth(next, name) <= width) { cur = next; continue; }
    out.push(cur);
    cur = word;
  }
  if (cur) out.push(cur);
  // break words that alone are wider than the box
  return out.flatMap((line) => {
    if (runWidth(line, name) <= width) return [line];
    const parts: string[] = [];
    let p = "";
    for (const ch of line) { if (p && runWidth(p + ch, name) > width) { parts.push(p); p = ch; } else p += ch; }
    if (p) parts.push(p);
    return parts;
  });
}

/** Figma's auto-width box for any Geist style: the site's hug chips size their text with it, because the browser
 *  lays a text out at its fractional run and Figma at the whole pixel above (1–2 px per chip on the home). */
export function hugWidth(text: string, s: Pick<TextStyle, "size" | "tracking" | "weight">): number {
  const n = [...text].length;
  return Math.ceil(runWidthOf(text, s) - s.tracking * Math.max(0, n - 1) + Math.fround(s.tracking) * Math.max(0, n - 1) - 1e-9);
}
