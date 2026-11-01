// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Multi-line (Chartory chart 012): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/multi-line
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/012-multi-line/data"
import { def } from "@/lib/chartory/charts/types/012-multi-line/layout"

registerChart(def, sample)

export type MultiLineData = typeof sample
export type MultiLineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: MultiLineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: MultiLineData[]
}

export function MultiLine(props: MultiLineProps) {
  return <ChartView def={def} {...props} />
}
