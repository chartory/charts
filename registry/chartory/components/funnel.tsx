// Funnel (Chartory chart 032): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/funnel
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/032-funnel/data"
import { def } from "@/lib/chartory/charts/types/032-funnel/layout"

registerChart(def, sample)

export type FunnelData = typeof sample
export type FunnelProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: FunnelData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: FunnelData[]
}

export function Funnel(props: FunnelProps) {
  return <ChartView def={def} {...props} />
}
