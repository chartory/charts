// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Parallel coordinates (Chartory chart 049): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/parallel-coordinates
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/049-parallel-coordinates/data"
import { def } from "@/lib/chartory/charts/types/049-parallel-coordinates/layout"

registerChart(def, sample)

export type ParallelCoordinatesData = typeof sample
export type ParallelCoordinatesProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ParallelCoordinatesData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ParallelCoordinatesData[]
}

export function ParallelCoordinates(props: ParallelCoordinatesProps) {
  return <ChartView def={def} {...props} />
}
