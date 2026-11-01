// Volume profile (Chartory chart 071): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/volume-profile
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/071-volume-profile/data"
import { def } from "@/lib/chartory/charts/types/071-volume-profile/layout"

registerChart(def, sample)

export type VolumeProfileData = typeof sample
export type VolumeProfileProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: VolumeProfileData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: VolumeProfileData[]
}

export function VolumeProfile(props: VolumeProfileProps) {
  return <ChartView def={def} {...props} />
}
