// Pass/fail grid (Chartory chart 099): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/pass-fail-grid
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/099-pass-fail-grid/data"
import { def } from "@/lib/chartory/charts/types/099-pass-fail-grid/layout"

registerChart(def, sample)

export type PassFailGridData = typeof sample
export type PassFailGridProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: PassFailGridData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: PassFailGridData[]
}

export function PassFailGrid(props: PassFailGridProps) {
  return <ChartView def={def} {...props} />
}
