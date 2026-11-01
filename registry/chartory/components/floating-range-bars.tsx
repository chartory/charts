// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Floating range bars (Chartory chart 005): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/floating-range-bars
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/005-floating-range-bars/data"
import { def } from "@/lib/chartory/charts/types/005-floating-range-bars/layout"

registerChart(def, sample)

export type FloatingRangeBarsData = typeof sample
export type FloatingRangeBarsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: FloatingRangeBarsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: FloatingRangeBarsData[]
}

export function FloatingRangeBars(props: FloatingRangeBarsProps) {
  return <ChartView def={def} {...props} />
}
