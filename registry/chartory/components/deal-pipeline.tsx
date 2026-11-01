// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Deal pipeline (Chartory chart 083): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/deal-pipeline
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/083-deal-pipeline/data"
import { def } from "@/lib/chartory/charts/types/083-deal-pipeline/layout"

registerChart(def, sample)

export type DealPipelineData = typeof sample
export type DealPipelineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: DealPipelineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: DealPipelineData[]
}

export function DealPipeline(props: DealPipelineProps) {
  return <ChartView def={def} {...props} />
}
