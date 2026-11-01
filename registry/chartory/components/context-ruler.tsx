// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Context ruler (Chartory chart 081): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/context-ruler
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/081-context-ruler/data"
import { def } from "@/lib/chartory/charts/types/081-context-ruler/layout"

registerChart(def, sample)

export type ContextRulerData = typeof sample
export type ContextRulerProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ContextRulerData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ContextRulerData[]
}

export function ContextRuler(props: ContextRulerProps) {
  return <ChartView def={def} {...props} />
}
