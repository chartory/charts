// Term cloud (Chartory chart 073): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/term-cloud
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/073-term-cloud/data"
import { def } from "@/lib/chartory/charts/types/073-term-cloud/layout"

registerChart(def, sample)

export type TermCloudData = typeof sample
export type TermCloudProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: TermCloudData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: TermCloudData[]
}

export function TermCloud(props: TermCloudProps) {
  return <ChartView def={def} {...props} />
}
