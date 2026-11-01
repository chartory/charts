// Cash cycle ring (Chartory chart 098): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/cash-cycle-ring
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/098-cash-cycle-ring/data"
import { def } from "@/lib/chartory/charts/types/098-cash-cycle-ring/layout"

registerChart(def, sample)

export type CashCycleRingData = typeof sample
export type CashCycleRingProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: CashCycleRingData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: CashCycleRingData[]
}

export function CashCycleRing(props: CashCycleRingProps) {
  return <ChartView def={def} {...props} />
}
