// Packed bubbles (Chartory chart 035): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/packed-bubbles
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/035-packed-bubbles/data"
import { def } from "@/lib/chartory/charts/types/035-packed-bubbles/layout"

registerChart(def, sample)

export type PackedBubblesData = typeof sample
export type PackedBubblesProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: PackedBubblesData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: PackedBubblesData[]
}

export function PackedBubbles(props: PackedBubblesProps) {
  return <ChartView def={def} {...props} />
}
