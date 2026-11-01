// Bar and line combo (Chartory chart 046): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/bar-and-line-combo
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/046-bar-and-line-combo/data"
import { def } from "@/lib/chartory/charts/types/046-bar-and-line-combo/layout"

registerChart(def, sample)

export type BarAndLineComboData = typeof sample
export type BarAndLineComboProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: BarAndLineComboData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: BarAndLineComboData[]
}

export function BarAndLineCombo(props: BarAndLineComboProps) {
  return <ChartView def={def} {...props} />
}
