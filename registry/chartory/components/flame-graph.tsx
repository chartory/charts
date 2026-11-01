// Flame graph (Chartory chart 074): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/flame-graph
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/074-flame-graph/data"
import { def } from "@/lib/chartory/charts/types/074-flame-graph/layout"

registerChart(def, sample)

export type FlameGraphData = typeof sample
export type FlameGraphProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: FlameGraphData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: FlameGraphData[]
}

export function FlameGraph(props: FlameGraphProps) {
  return <ChartView def={def} {...props} />
}
