// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Underwater drawdown (Chartory chart 080): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/underwater-drawdown
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/080-underwater-drawdown/data"
import { def } from "@/lib/chartory/charts/types/080-underwater-drawdown/layout"

registerChart(def, sample)

export type UnderwaterDrawdownData = typeof sample
export type UnderwaterDrawdownProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: UnderwaterDrawdownData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: UnderwaterDrawdownData[]
}

export function UnderwaterDrawdown(props: UnderwaterDrawdownProps) {
  return <ChartView def={def} {...props} />
}
