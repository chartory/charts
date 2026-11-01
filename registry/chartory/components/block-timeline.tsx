// Block timeline (Chartory chart 038): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/block-timeline
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/038-block-timeline/data"
import { def } from "@/lib/chartory/charts/types/038-block-timeline/layout"

registerChart(def, sample)

export type BlockTimelineData = typeof sample
export type BlockTimelineProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BlockTimelineData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BlockTimelineData[]
}

export function BlockTimeline(props: BlockTimelineProps) {
  return <ChartView def={def} {...props} />
}
