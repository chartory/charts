// 076 Load plan · sample data (Figma chart/076, logistics: wave 3 outbound trucks, pallet columns [width, stack]).
import type { LoadPlanData } from "../../plots/load-plan";

const A = "data/cat-2", Ch = "data/cat-3", F = "data/cat-5", R = "data/cat-9";

export const data: LoadPlanData = {
  trucks: [
    { label: "T1 · HAMBURG", pct: 92, cols: [[40, [Ch, Ch]], [40, [Ch, Ch]], [36, [A, A]], [52, [A]], [36, [A, F]], [44, [A, A]], [30, [F]], [36, [A, A]], [26, [R]]] },
    { label: "T2 · BREMEN", pct: 88, cols: [[40, [Ch, Ch]], [44, [A, A]], [52, [A]], [36, [F, F]], [40, [A, A]], [36, [A]], [44, [A, R]], [30, [R]]] },
    { label: "T3 · KIEL", pct: 81, cols: [[40, [Ch, Ch]], [40, [A, A]], [52, [A]], [36, [F, A]], [40, [A, A]], [36, [R]], [30, [A]]] },
  ],
};
