// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Event barcode (Chartory chart 061): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/event-barcode
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/061-event-barcode/data"
import { def } from "@/lib/chartory/charts/types/061-event-barcode/layout"

registerChart(def, sample)

export type EventBarcodeData = typeof sample
export type EventBarcodeProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: EventBarcodeData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: EventBarcodeData[]
}

export function EventBarcode(props: EventBarcodeProps) {
  return <ChartView def={def} {...props} />
}
