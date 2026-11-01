// Network (Chartory chart 039): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/network
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/039-network/data"
import { def } from "@/lib/chartory/charts/types/039-network/layout"

registerChart(def, sample)

export type NetworkData = typeof sample
export type NetworkProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: NetworkData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: NetworkData[]
}

export function Network(props: NetworkProps) {
  return <ChartView def={def} {...props} />
}
