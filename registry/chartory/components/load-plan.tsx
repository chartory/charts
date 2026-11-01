// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Load plan (Chartory chart 076): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/load-plan
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/076-load-plan/data"
import { def } from "@/lib/chartory/charts/types/076-load-plan/layout"

registerChart(def, sample)

export type LoadPlanData = typeof sample
export type LoadPlanProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: LoadPlanData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: LoadPlanData[]
}

export function LoadPlan(props: LoadPlanProps) {
  return <ChartView def={def} {...props} />
}
