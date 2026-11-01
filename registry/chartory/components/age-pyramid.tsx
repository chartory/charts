// Age pyramid (Chartory chart 082): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/age-pyramid
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/082-age-pyramid/data"
import { def } from "@/lib/chartory/charts/types/082-age-pyramid/layout"

registerChart(def, sample)

export type AgePyramidData = typeof sample
export type AgePyramidProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: AgePyramidData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: AgePyramidData[]
}

export function AgePyramid(props: AgePyramidProps) {
  return <ChartView def={def} {...props} />
}
