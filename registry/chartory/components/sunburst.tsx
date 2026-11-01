// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Sunburst (Chartory chart 022): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/sunburst
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/022-sunburst/data"
import { def } from "@/lib/chartory/charts/types/022-sunburst/layout"

registerChart(def, sample)

export type SunburstData = typeof sample
export type SunburstProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: SunburstData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: SunburstData[]
}

export function Sunburst(props: SunburstProps) {
  return <ChartView def={def} {...props} />
}
