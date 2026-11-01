// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// The Signal collection's hook in the core (2026-11-01: Hearth is free in code, Signal comes with Code and Complete).
// The core draws Hearth; with collection="signal" it asks this hook for the Signal parts: the text mapping, the card,
// legend and post-pass, and each plot's own Signal renderer. They live in charts/signal (@chartory/signal), which
// fills the hook when it is imported: `import "@/lib/chartory/charts/signal"` once (the widget kit imports it). The
// site imports it with the core (core/shell.ts). Without it a Signal chart stops with a message saying so.
import type { Kit } from "./kit";
import type { Frame } from "./node";

/** a plot's Signal renderer: the plot's own signature (its data type differs per plot) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each plot passes its own data type
export type SignalPlot = (K: Kit, p: Frame, w: number, o: any) => Frame;

export type SignalParts = {
  /** text: a kit style that is already the collection's; the kit style → the collection's; the kit's caps in sentence case */
  isSignalStyle: (s: string) => boolean;
  mapStyle: (s: string) => string;
  tx: (s: string | number) => string;
  /** the card, legend and post-pass buildTree / buildBox run in Signal */
  styleCard: (card: Frame) => void;
  legend: (p: Frame, items: [string, string][]) => Frame;
  post: (pl: Frame, pw: number, PH: number) => void;
  mapPaints: (root: Frame) => void;
  settle: (root: Frame) => void;
  SIGNAL_H: Record<"xs" | "s" | "m" | "l", number>;
  /** the plots with their own Signal drawing, by plot module name (bullet, sankey, vbars …) */
  plots: Record<string, SignalPlot>;
};

let parts: SignalParts | null = null;

/** charts/signal fills the hook (once; a second import changes nothing) */
export function setSignal(p: SignalParts): void {
  parts = p;
}

const MISSING = 'The Signal collection comes with Chartory Code and Complete: run npx shadcn add @chartory/signal, then import "@/lib/chartory/charts/signal" once (for example in your root layout). Hearth (the default collection) needs neither.';

export function signal(): SignalParts {
  if (!parts) throw new Error(MISSING);
  return parts;
}

/** a plot's Signal renderer */
export function signalPlot(name: string): SignalPlot {
  const p = signal().plots[name];
  if (!p) throw new Error(`Chartory: no Signal renderer for the ${name} plot.`);
  return p;
}
