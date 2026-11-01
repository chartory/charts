// Diverging bars (Chartory chart 004): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/diverging-bars
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/004-diverging-bars/data"
import { def } from "@/lib/chartory/charts/types/004-diverging-bars/layout"

registerChart(def, sample)

export type DivergingBarsData = typeof sample
export type DivergingBarsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DivergingBarsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DivergingBarsData[]
}

export function DivergingBars(props: DivergingBarsProps) {
  return <ChartView def={def} {...props} />
}
