// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Horizontal bars (Chartory chart 007): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/horizontal-bars
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/007-horizontal-bars/data"
import { def } from "@/lib/chartory/charts/types/007-horizontal-bars/layout"

registerChart(def, sample)

export type HorizontalBarsData = typeof sample
export type HorizontalBarsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: HorizontalBarsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: HorizontalBarsData[]
}

export function HorizontalBars(props: HorizontalBarsProps) {
  return <ChartView def={def} {...props} />
}
