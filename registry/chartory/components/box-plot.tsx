// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Box plot (Chartory chart 043): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/box-plot
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/043-box-plot/data"
import { def } from "@/lib/chartory/charts/types/043-box-plot/layout"

registerChart(def, sample)

export type BoxPlotData = typeof sample
export type BoxPlotProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BoxPlotData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BoxPlotData[]
}

export function BoxPlot(props: BoxPlotProps) {
  return <ChartView def={def} {...props} />
}
