// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Hex grid (Chartory chart 028): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/hex-grid
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/028-hex-grid/data"
import { def } from "@/lib/chartory/charts/types/028-hex-grid/layout"

registerChart(def, sample)

export type HexGridData = typeof sample
export type HexGridProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: HexGridData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: HexGridData[]
}

export function HexGrid(props: HexGridProps) {
  return <ChartView def={def} {...props} />
}
