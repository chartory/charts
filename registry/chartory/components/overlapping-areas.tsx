// Overlapping areas (Chartory chart 013): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/overlapping-areas
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/013-overlapping-areas/data"
import { def } from "@/lib/chartory/charts/types/013-overlapping-areas/layout"

registerChart(def, sample)

export type OverlappingAreasData = typeof sample
export type OverlappingAreasProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: OverlappingAreasData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: OverlappingAreasData[]
}

export function OverlappingAreas(props: OverlappingAreasProps) {
  return <ChartView def={def} {...props} />
}
