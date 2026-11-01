// Dot strip (Chartory chart 033): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/dot-strip
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/033-dot-strip/data"
import { def } from "@/lib/chartory/charts/types/033-dot-strip/layout"

registerChart(def, sample)

export type DotStripData = typeof sample
export type DotStripProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DotStripData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DotStripData[]
}

export function DotStrip(props: DotStripProps) {
  return <ChartView def={def} {...props} />
}
