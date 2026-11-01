// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Bump (Chartory chart 045): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/bump
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/045-bump/data"
import { def } from "@/lib/chartory/charts/types/045-bump/layout"

registerChart(def, sample)

export type BumpData = typeof sample
export type BumpProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BumpData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BumpData[]
}

export function Bump(props: BumpProps) {
  return <ChartView def={def} {...props} />
}
