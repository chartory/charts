// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Gauge (Chartory chart 021): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/gauge
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/021-gauge/data"
import { def } from "@/lib/chartory/charts/types/021-gauge/layout"

registerChart(def, sample)

export type GaugeData = typeof sample
export type GaugeProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: GaugeData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: GaugeData[]
}

export function Gauge(props: GaugeProps) {
  return <ChartView def={def} {...props} />
}
