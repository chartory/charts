// Vertical profile (Chartory chart 016): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/vertical-profile
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/016-vertical-profile/data"
import { def } from "@/lib/chartory/charts/types/016-vertical-profile/layout"

registerChart(def, sample)

export type VerticalProfileData = typeof sample
export type VerticalProfileProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: VerticalProfileData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: VerticalProfileData[]
}

export function VerticalProfile(props: VerticalProfileProps) {
  return <ChartView def={def} {...props} />
}
