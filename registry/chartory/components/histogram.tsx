// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Histogram (Chartory chart 006): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/histogram
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/006-histogram/data"
import { def } from "@/lib/chartory/charts/types/006-histogram/layout"

registerChart(def, sample)

export type HistogramData = typeof sample
export type HistogramProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: HistogramData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: HistogramData[]
}

export function Histogram(props: HistogramProps) {
  return <ChartView def={def} {...props} />
}
