// Stacked bars (Chartory chart 003): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/stacked-bars
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/003-stacked-bars/data"
import { def } from "@/lib/chartory/charts/types/003-stacked-bars/layout"

registerChart(def, sample)

export type StackedBarsData = typeof sample
export type StackedBarsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: StackedBarsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: StackedBarsData[]
}

export function StackedBars(props: StackedBarsProps) {
  return <ChartView def={def} {...props} />
}
