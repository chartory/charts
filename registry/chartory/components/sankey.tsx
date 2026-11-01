// Sankey (Chartory chart 031): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/sankey
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/031-sankey/data"
import { def } from "@/lib/chartory/charts/types/031-sankey/layout"

registerChart(def, sample)

export type SankeyData = typeof sample
export type SankeyProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: SankeyData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: SankeyData[]
}

export function Sankey(props: SankeyProps) {
  return <ChartView def={def} {...props} />
}
