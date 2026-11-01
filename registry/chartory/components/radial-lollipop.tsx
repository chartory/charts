// Radial lollipop (Chartory chart 094): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/radial-lollipop
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/094-radial-lollipop/data"
import { def } from "@/lib/chartory/charts/types/094-radial-lollipop/layout"

registerChart(def, sample)

export type RadialLollipopData = typeof sample
export type RadialLollipopProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RadialLollipopData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RadialLollipopData[]
}

export function RadialLollipop(props: RadialLollipopProps) {
  return <ChartView def={def} {...props} />
}
