// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Waterfall (Chartory chart 042): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/waterfall
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/042-waterfall/data"
import { def } from "@/lib/chartory/charts/types/042-waterfall/layout"

registerChart(def, sample)

export type WaterfallData = typeof sample
export type WaterfallProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: WaterfallData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: WaterfallData[]
}

export function Waterfall(props: WaterfallProps) {
  return <ChartView def={def} {...props} />
}
