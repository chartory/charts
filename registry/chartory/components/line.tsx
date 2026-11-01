// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Line (Chartory chart 010): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/line
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/010-line/data"
import { def } from "@/lib/chartory/charts/types/010-line/layout"

registerChart(def, sample)

export type LineData = typeof sample
export type LineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: LineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: LineData[]
}

export function Line(props: LineProps) {
  return <ChartView def={def} {...props} />
}
