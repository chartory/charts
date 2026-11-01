// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Donut (Chartory chart 017): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/donut
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/017-donut/data"
import { def } from "@/lib/chartory/charts/types/017-donut/layout"

registerChart(def, sample)

export type DonutData = typeof sample
export type DonutProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DonutData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DonutData[]
}

export function Donut(props: DonutProps) {
  return <ChartView def={def} {...props} />
}
