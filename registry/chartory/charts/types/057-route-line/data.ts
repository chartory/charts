// 057 Route progress · sample data (Figma chart/057, from the Figma definition, seeded values expanded).
import type { MetroData } from "../../plots/metro";

export const data: MetroData = {
  stops: [
    { name: "Depot", eta: "07:30", state: "done" },
    { name: "Alder St", eta: "07:52", state: "done" },
    { name: "Bay Rd", eta: "08:10", state: "done" },
    { name: "Cole Sq", eta: "08:31", state: "done" },
    { name: "Dock 4", eta: "08:58", state: "done" },
    { name: "Elm Park", eta: "NOW", state: "now" },
    { name: "Fern Hill", eta: "09:46", state: "next" },
    { name: "Gate 9", eta: "10:05", state: "next" },
    { name: "Harbor", eta: "10:28", state: "next" },
    { name: "Iris Ave", eta: "10:51", state: "next" },
    { name: "Juniper", eta: "11:14", state: "next" },
    { name: "Depot", eta: "11:40", state: "next" }
  ]
};
