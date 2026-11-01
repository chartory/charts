// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Cluster map (Chartory chart 091): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/cluster-map
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/091-cluster-map/data"
import { def } from "@/lib/chartory/charts/types/091-cluster-map/layout"

registerChart(def, sample)

export type ClusterMapData = typeof sample
export type ClusterMapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ClusterMapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ClusterMapData[]
}

export function ClusterMap(props: ClusterMapProps) {
  return <ChartView def={def} {...props} />
}
