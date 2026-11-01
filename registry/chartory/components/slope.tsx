// Slope (Chartory chart 044): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/slope
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/044-slope/data"
import { def } from "@/lib/chartory/charts/types/044-slope/layout"

registerChart(def, sample)

export type SlopeData = typeof sample
export type SlopeProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: SlopeData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: SlopeData[]
}

export function Slope(props: SlopeProps) {
  return <ChartView def={def} {...props} />
}
