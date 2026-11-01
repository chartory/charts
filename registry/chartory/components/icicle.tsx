// Icicle (Chartory chart 068): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/icicle
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/068-icicle/data"
import { def } from "@/lib/chartory/charts/types/068-icicle/layout"

registerChart(def, sample)

export type IcicleData = typeof sample
export type IcicleProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: IcicleData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: IcicleData[]
}

export function Icicle(props: IcicleProps) {
  return <ChartView def={def} {...props} />
}
