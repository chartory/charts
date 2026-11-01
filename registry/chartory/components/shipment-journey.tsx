// Shipment journey (Chartory chart 096): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/shipment-journey
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/096-shipment-journey/data"
import { def } from "@/lib/chartory/charts/types/096-shipment-journey/layout"

registerChart(def, sample)

export type ShipmentJourneyData = typeof sample
export type ShipmentJourneyProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: ShipmentJourneyData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: ShipmentJourneyData[]
}

export function ShipmentJourney(props: ShipmentJourneyProps) {
  return <ChartView def={def} {...props} />
}
