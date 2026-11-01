// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Treemap (Chartory chart 030): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/treemap
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/030-treemap/data"
import { def } from "@/lib/chartory/charts/types/030-treemap/layout"

registerChart(def, sample)

export type TreemapData = typeof sample
export type TreemapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: TreemapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: TreemapData[]
}

export function Treemap(props: TreemapProps) {
  return <ChartView def={def} {...props} />
}
