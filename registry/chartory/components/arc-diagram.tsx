// Arc diagram (Chartory chart 064): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/arc-diagram
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/064-arc-diagram/data"
import { def } from "@/lib/chartory/charts/types/064-arc-diagram/layout"

registerChart(def, sample)

export type ArcDiagramData = typeof sample
export type ArcDiagramProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ArcDiagramData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ArcDiagramData[]
}

export function ArcDiagram(props: ArcDiagramProps) {
  return <ChartView def={def} {...props} />
}
