// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Correlation triangle (Chartory chart 085): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/correlation-triangle
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/085-correlation-triangle/data"
import { def } from "@/lib/chartory/charts/types/085-correlation-triangle/layout"

registerChart(def, sample)

export type CorrelationTriangleData = typeof sample
export type CorrelationTriangleProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: CorrelationTriangleData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: CorrelationTriangleData[]
}

export function CorrelationTriangle(props: CorrelationTriangleProps) {
  return <ChartView def={def} {...props} />
}
