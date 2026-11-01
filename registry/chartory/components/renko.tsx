// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Renko (Chartory chart 056): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/renko
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/056-renko/data"
import { def } from "@/lib/chartory/charts/types/056-renko/layout"

registerChart(def, sample)

export type RenkoData = typeof sample
export type RenkoProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: RenkoData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: RenkoData[]
}

export function Renko(props: RenkoProps) {
  return <ChartView def={def} {...props} />
}
