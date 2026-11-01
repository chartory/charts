// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Scatter (Chartory chart 034): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/scatter
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/034-scatter/data"
import { def } from "@/lib/chartory/charts/types/034-scatter/layout"

registerChart(def, sample)

export type ScatterData = typeof sample
export type ScatterProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ScatterData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ScatterData[]
}

export function Scatter(props: ScatterProps) {
  return <ChartView def={def} {...props} />
}
