// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// Tile map (Chartory chart 029): sizes xs | s | m | l, laid out again from the data at each
// size; collection "hearth" (default) or "signal" (with @chartory/signal, Code and Complete). Data in the type's shape (default: the sample). Docs:
// https://usechartory.com/docs/charts/tile-map
import { ChartView, type ChartViewProps } from "@/lib/chartory/charts/chart-view"
import { registerChart } from "@/lib/chartory/charts/defs"
import { data as sample } from "@/lib/chartory/charts/types/029-tile-map/data"
import { def } from "@/lib/chartory/charts/types/029-tile-map/layout"

registerChart(def, sample)

export type TileMapData = typeof sample
export type TileMapProps = Omit<ChartViewProps, "def" | "data" | "states"> & {
  /** the data to draw (default: the sample) */
  data?: TileMapData
  /** further data states: the chart morphs to them (update) or ticks through them (live, with interval) */
  states?: TileMapData[]
}

export function TileMap(props: TileMapProps) {
  return <ChartView def={def} {...props} />
}
