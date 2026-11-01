// Gantt (Chartory chart 037): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/gantt
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/037-gantt/data"
import { def } from "@/lib/chartory/charts/types/037-gantt/layout"

registerChart(def, sample)

export type GanttData = typeof sample
export type GanttProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: GanttData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: GanttData[]
}

export function Gantt(props: GanttProps) {
  return <ChartView def={def} {...props} />
}
