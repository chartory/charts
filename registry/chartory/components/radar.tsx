// Radar (Chartory chart 023): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/radar
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/023-radar/data"
import { def } from "@/lib/chartory/charts/types/023-radar/layout"

registerChart(def, sample)

export type RadarData = typeof sample
export type RadarProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RadarData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RadarData[]
}

export function Radar(props: RadarProps) {
  return <ChartView def={def} {...props} />
}
