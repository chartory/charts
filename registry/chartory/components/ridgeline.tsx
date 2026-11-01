// Ridgeline (Chartory chart 055): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/ridgeline
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/055-ridgeline/data"
import { def } from "@/lib/chartory/charts/types/055-ridgeline/layout"

registerChart(def, sample)

export type RidgelineData = typeof sample
export type RidgelineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RidgelineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RidgelineData[]
}

export function Ridgeline(props: RidgelineProps) {
  return <ChartView def={def} {...props} />
}
