// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Marimekko (Chartory chart 047): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/marimekko
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/047-marimekko/data"
import { def } from "@/lib/chartory/charts/types/047-marimekko/layout"

registerChart(def, sample)

export type MarimekkoData = typeof sample
export type MarimekkoProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: MarimekkoData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: MarimekkoData[]
}

export function Marimekko(props: MarimekkoProps) {
  return <ChartView def={def} {...props} />
}
