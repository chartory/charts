// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Funding stripes (Chartory chart 090): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/funding-stripes
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/090-funding-stripes/data"
import { def } from "@/lib/chartory/charts/types/090-funding-stripes/layout"

registerChart(def, sample)

export type FundingStripesData = typeof sample
export type FundingStripesProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: FundingStripesData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: FundingStripesData[]
}

export function FundingStripes(props: FundingStripesProps) {
  return <ChartView def={def} {...props} />
}
