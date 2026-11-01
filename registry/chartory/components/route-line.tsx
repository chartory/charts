// Route line (Chartory chart 057): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/route-line
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/057-route-line/data"
import { def } from "@/lib/chartory/charts/types/057-route-line/layout"

registerChart(def, sample)

export type RouteLineData = typeof sample
export type RouteLineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RouteLineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RouteLineData[]
}

export function RouteLine(props: RouteLineProps) {
  return <ChartView def={def} {...props} />
}
