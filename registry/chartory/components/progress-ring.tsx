// Progress ring (Chartory chart 020): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/progress-ring
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/020-progress-ring/data"
import { def } from "@/lib/chartory/charts/types/020-progress-ring/layout"

registerChart(def, sample)

export type ProgressRingData = typeof sample
export type ProgressRingProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ProgressRingData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ProgressRingData[]
}

export function ProgressRing(props: ProgressRingProps) {
  return <ChartView def={def} {...props} />
}
