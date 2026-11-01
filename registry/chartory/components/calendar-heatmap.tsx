// Calendar heatmap (Chartory chart 025): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/calendar-heatmap
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/025-calendar-heatmap/data"
import { def } from "@/lib/chartory/charts/types/025-calendar-heatmap/layout"

registerChart(def, sample)

export type CalendarHeatmapData = typeof sample
export type CalendarHeatmapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: CalendarHeatmapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: CalendarHeatmapData[]
}

export function CalendarHeatmap(props: CalendarHeatmapProps) {
  return <ChartView def={def} {...props} />
}
