// Gains curve (Chartory chart 060): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/gains-curve
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/060-gains-curve/data"
import { def } from "@/lib/chartory/charts/types/060-gains-curve/layout"

registerChart(def, sample)

export type GainsCurveData = typeof sample
export type GainsCurveProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: GainsCurveData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: GainsCurveData[]
}

export function GainsCurve(props: GainsCurveProps) {
  return <ChartView def={def} {...props} />
}
