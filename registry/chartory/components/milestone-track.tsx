// Milestone track (Chartory chart 079): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/milestone-track
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/079-milestone-track/data"
import { def } from "@/lib/chartory/charts/types/079-milestone-track/layout"

registerChart(def, sample)

export type MilestoneTrackData = typeof sample
export type MilestoneTrackProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: MilestoneTrackData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: MilestoneTrackData[]
}

export function MilestoneTrack(props: MilestoneTrackProps) {
  return <ChartView def={def} {...props} />
}
