// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Streamgraph (Chartory chart 014): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/streamgraph
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/014-streamgraph/data"
import { def } from "@/lib/chartory/charts/types/014-streamgraph/layout"

registerChart(def, sample)

export type StreamgraphData = typeof sample
export type StreamgraphProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: StreamgraphData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: StreamgraphData[]
}

export function Streamgraph(props: StreamgraphProps) {
  return <ChartView def={def} {...props} />
}
