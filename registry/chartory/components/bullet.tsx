// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Bullet (Chartory chart 008): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/bullet
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/008-bullet/data"
import { def } from "@/lib/chartory/charts/types/008-bullet/layout"

registerChart(def, sample)

export type BulletData = typeof sample
export type BulletProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BulletData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BulletData[]
}

export function Bullet(props: BulletProps) {
  return <ChartView def={def} {...props} />
}
