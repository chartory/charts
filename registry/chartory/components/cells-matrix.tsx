// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Cells matrix (Chartory chart 027): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/cells-matrix
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/027-cells-matrix/data"
import { def } from "@/lib/chartory/charts/types/027-cells-matrix/layout"

registerChart(def, sample)

export type CellsMatrixData = typeof sample
export type CellsMatrixProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: CellsMatrixData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: CellsMatrixData[]
}

export function CellsMatrix(props: CellsMatrixProps) {
  return <ChartView def={def} {...props} />
}
