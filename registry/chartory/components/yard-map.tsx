// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Yard map (Chartory chart 058): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/yard-map
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/058-yard-map/data"
import { def } from "@/lib/chartory/charts/types/058-yard-map/layout"

registerChart(def, sample)

export type YardMapData = typeof sample
export type YardMapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: YardMapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: YardMapData[]
}

export function YardMap(props: YardMapProps) {
  return <ChartView def={def} {...props} />
}
