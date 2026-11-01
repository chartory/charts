// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Rate dot plot (Chartory chart 062): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/rate-dot-plot
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/062-rate-dot-plot/data"
import { def } from "@/lib/chartory/charts/types/062-rate-dot-plot/layout"

registerChart(def, sample)

export type RateDotPlotData = typeof sample
export type RateDotPlotProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RateDotPlotData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RateDotPlotData[]
}

export function RateDotPlot(props: RateDotPlotProps) {
  return <ChartView def={def} {...props} />
}
