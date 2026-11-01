// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Star ratings (Chartory chart 093): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/star-ratings
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/093-star-ratings/data"
import { def } from "@/lib/chartory/charts/types/093-star-ratings/layout"

registerChart(def, sample)

export type StarRatingsData = typeof sample
export type StarRatingsProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: StarRatingsData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: StarRatingsData[]
}

export function StarRatings(props: StarRatingsProps) {
  return <ChartView def={def} {...props} />
}
