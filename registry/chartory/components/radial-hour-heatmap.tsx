// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Radial hour heatmap (Chartory chart 052): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/radial-hour-heatmap
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/052-radial-hour-heatmap/data"
import { def } from "@/lib/chartory/charts/types/052-radial-hour-heatmap/layout"

registerChart(def, sample)

export type RadialHourHeatmapData = typeof sample
export type RadialHourHeatmapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RadialHourHeatmapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RadialHourHeatmapData[]
}

export function RadialHourHeatmap(props: RadialHourHeatmapProps) {
  return <ChartView def={def} {...props} />
}
