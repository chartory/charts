// 096 Shipment journey · sample data (Figma chart/096, logistics: shipment 4471 Shanghai → Leeds, days from Oct 1).
import type { JourneyData } from "../../plots/journey";

export const data: JourneyData = {
  t0: 0,
  t1: 14,
  now: 9.4,
  phases: [[0, 1, "data/cat-2"], [1, 7, "data/primary"], [7, 9, "status/warning"], [9, 9.4, "data/cat-3"]],
  xl: [[0, "OCT 1"], [7, "OCT 8"], [14, "OCT 15"]],
  events: [
    { t: 0, label: "Picked up", date: "OCT 1", up: true },
    { t: 1, label: "Sailed", date: "OCT 2", up: false },
    { t: 7, label: "At port", date: "OCT 8", up: true },
    { t: 9, label: "Cleared", date: "OCT 10", up: false },
    { t: 12, label: "Out for delivery", date: "OCT 13 · ETA", up: true },
    { t: 13.5, label: "Delivered", date: "OCT 14 · ETA", up: false },
  ],
};
