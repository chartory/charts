// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Reconciliation (Chartory chart 075): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/reconciliation
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/075-reconciliation/data"
import { def } from "@/lib/chartory/charts/types/075-reconciliation/layout"

registerChart(def, sample)

export type ReconciliationData = typeof sample
export type ReconciliationProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ReconciliationData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ReconciliationData[]
}

export function Reconciliation(props: ReconciliationProps) {
  return <ChartView def={def} {...props} />
}
