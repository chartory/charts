// Heatmap (Chartory chart 024): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/heatmap
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/024-heatmap/data"
import { def } from "@/lib/chartory/charts/types/024-heatmap/layout"

registerChart(def, sample)

export type HeatmapData = typeof sample
export type HeatmapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: HeatmapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: HeatmapData[]
}

export function Heatmap(props: HeatmapProps) {
  return <ChartView def={def} {...props} />
}
