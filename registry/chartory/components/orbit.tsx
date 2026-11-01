// Orbit (Chartory chart 041): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/orbit
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/041-orbit/data"
import { def } from "@/lib/chartory/charts/types/041-orbit/layout"

registerChart(def, sample)

export type OrbitData = typeof sample
export type OrbitProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: OrbitData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: OrbitData[]
}

export function Orbit(props: OrbitProps) {
  return <ChartView def={def} {...props} />
}
