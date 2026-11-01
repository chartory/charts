// 070 Uptime bars · sample data (Figma chart/070, daily state of 3 services over the last 63 days, oldest first).
import type { UptimeData } from "../../plots/uptime";

const days = (f: (i: number) => string) => Array.from({ length: 63 }, (_, i) => f(i));

export const data: UptimeData = {
  from: "63 DAYS AGO", to: "TODAY",
  toks: { ok: "status/success", slow: "status/warning", down: "status/danger" },
  rows: [
    { label: "API", text: "99.98%", days: days((i) => (i === 21 ? "slow" : "ok")) },
    { label: "Dashboard", text: "99.99%", days: days(() => "ok") },
    { label: "Webhooks", text: "99.91%", days: days((i) => (i === 47 ? "down" : i === 48 || i === 12 ? "slow" : "ok")) },
  ],
};
