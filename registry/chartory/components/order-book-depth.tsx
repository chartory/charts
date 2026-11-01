// Order book depth (Chartory chart 053): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/order-book-depth
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/053-order-book-depth/data"
import { def } from "@/lib/chartory/charts/types/053-order-book-depth/layout"

registerChart(def, sample)

export type OrderBookDepthData = typeof sample
export type OrderBookDepthProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: OrderBookDepthData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: OrderBookDepthData[]
}

export function OrderBookDepth(props: OrderBookDepthProps) {
  return <ChartView def={def} {...props} />
}
