// The chart definitions a page can draw, by type number (registry plan step 1). Widgets and helpers look a type up
// here instead of importing every type: the site registers all 132 (registry.ts), a package component registers only
// its own (components/chartory/<slug>.tsx), so a buyer's bundle carries the types it uses.
import type { ChartDef } from "./core/shell";

const DEFS = new Map<number, { def: ChartDef; sample: unknown }>();

export function registerChart(def: ChartDef, sample: unknown): void {
  DEFS.set(def.no, { def, sample });
}

/** the type's definition; a type that is not registered is a setup error, said plainly */
export function chartDef(no: number): ChartDef {
  const d = DEFS.get(no);
  if (!d) throw new Error(`Chartory: chart type ${no} is not registered. Import its component (components/chartory/<slug>) before drawing its widget.`);
  return d.def;
}

/** the type's sample data (from the Figma kit); a function when the sample depends on the plot width (008) */
export const chartSample = (no: number): unknown => DEFS.get(no)?.sample;
