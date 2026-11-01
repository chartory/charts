// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Chord (Chartory chart 048): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/chord
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/048-chord/data"
import { def } from "@/lib/chartory/charts/types/048-chord/layout"

registerChart(def, sample)

export type ChordData = typeof sample
export type ChordProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ChordData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ChordData[]
}

export function Chord(props: ChordProps) {
  return <ChartView def={def} {...props} />
}
