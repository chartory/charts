// SPDX-License-Identifier: MIT · Copyright (c) 2026 BEY AGENCY LTD · Chartory, usechartory.com
// 088 Drive time zones · sample data (Figma chart/088-isochrone-depot).
import type { IsochroneData } from "../../plots/isochrone";

export const data: IsochroneData = {
  rings: [15, 30, 45, 60],
  pts: [[1.554, 18.2, false], [0.376, 13.7, false], [0.869, 34.8, false], [3.609, 16, false], [3.882, 31.1, false], [3.63, 27.9, false], [2.777, 55, true], [0.303, 54.8, true], [5.744, 42.5, false], [1.772, 51, true], [4.712, 41.8, false], [4.137, 15.9, false], [6.254, 53.1, true], [3.556, 25.7, false], [4.72, 15.8, false], [0.413, 49.8, true], [3.098, 54.9, true], [4.47, 51.9, false], [4.828, 42.5, false], [1.569, 10.9, false], [0.608, 27.3, false], [5.219, 8.5, false], [4.852, 22.2, false], [2.365, 29.8, false], [1.452, 57.5, true], [2.862, 39.2, false], [4.314, 50.4, false], [5.446, 41.3, false], [5.92, 45.2, false], [4.262, 26.4, false], [5.396, 14.5, false], [5.105, 56.4, true], [6.062, 42.3, false], [6.21, 56.6, false], [2.603, 38.1, false], [5.963, 27.9, false], [4.871, 31.7, false], [2.401, 8, false], [0.963, 26.7, false], [5.584, 25.6, false], [0.357, 38.2, false], [1.747, 19.3, false], [2.183, 52.9, true], [1.326, 21, false], [2.172, 22.4, false], [6.191, 39.5, false], [5.755, 21.3, false], [0.13, 49, true], [2.31, 27.6, false], [1.974, 53.3, true], [0.395, 42.4, false], [0.949, 28.2, false], [1.052, 20.9, false], [2.202, 35, false], [6.263, 29.4, false], [3.57, 11.9, false], [4.874, 23, false], [3.968, 33.7, false]],
  rows: [{ label: "Under 30 min", text: "48%" }, { label: "30–60 min", text: "52%" }, { label: "Late stops", text: "11", tone: "status/danger" }],
};
