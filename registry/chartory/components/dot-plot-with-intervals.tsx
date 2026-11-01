// Dot plot with intervals (Chartory chart 050): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/dot-plot-with-intervals
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/050-dot-plot-with-intervals/data"
import { def } from "@/lib/chartory/charts/types/050-dot-plot-with-intervals/layout"

registerChart(def, sample)

export type DotPlotWithIntervalsData = typeof sample
export type DotPlotWithIntervalsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DotPlotWithIntervalsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DotPlotWithIntervalsData[]
}

export function DotPlotWithIntervals(props: DotPlotWithIntervalsProps) {
  return <ChartView def={def} {...props} />
}
