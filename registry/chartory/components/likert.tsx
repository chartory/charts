// Likert (Chartory chart 063): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/likert
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/063-likert/data"
import { def } from "@/lib/chartory/charts/types/063-likert/layout"

registerChart(def, sample)

export type LikertData = typeof sample
export type LikertProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: LikertData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: LikertData[]
}

export function Likert(props: LikertProps) {
  return <ChartView def={def} {...props} />
}
