// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Bowtie (Chartory chart 087): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/bowtie
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/087-bowtie/data"
import { def } from "@/lib/chartory/charts/types/087-bowtie/layout"

registerChart(def, sample)

export type BowtieData = typeof sample
export type BowtieProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BowtieData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BowtieData[]
}

export function Bowtie(props: BowtieProps) {
  return <ChartView def={def} {...props} />
}
