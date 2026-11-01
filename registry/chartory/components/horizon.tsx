// Horizon (Chartory chart 054): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/horizon
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/054-horizon/data"
import { def } from "@/lib/chartory/charts/types/054-horizon/layout"

registerChart(def, sample)

export type HorizonData = typeof sample
export type HorizonProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: HorizonData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: HorizonData[]
}

export function Horizon(props: HorizonProps) {
  return <ChartView def={def} {...props} />
}
