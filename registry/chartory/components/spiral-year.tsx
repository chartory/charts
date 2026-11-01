// Spiral year (Chartory chart 051): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/spiral-year
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/051-spiral-year/data"
import { def } from "@/lib/chartory/charts/types/051-spiral-year/layout"

registerChart(def, sample)

export type SpiralYearData = typeof sample
export type SpiralYearProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: SpiralYearData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: SpiralYearData[]
}

export function SpiralYear(props: SpiralYearProps) {
  return <ChartView def={def} {...props} />
}
