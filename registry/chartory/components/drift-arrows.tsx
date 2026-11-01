// Drift arrows (Chartory chart 089): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/drift-arrows
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/089-drift-arrows/data"
import { def } from "@/lib/chartory/charts/types/089-drift-arrows/layout"

registerChart(def, sample)

export type DriftArrowsData = typeof sample
export type DriftArrowsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DriftArrowsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DriftArrowsData[]
}

export function DriftArrows(props: DriftArrowsProps) {
  return <ChartView def={def} {...props} />
}
