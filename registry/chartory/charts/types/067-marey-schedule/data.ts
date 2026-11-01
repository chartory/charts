// 067 Marey schedule · sample data (Figma chart/067, 4 vans on a 6-stop route, 08:00 to 12:00; times in minutes after 08:00, [arrive, depart]).
import type { MareyData } from "../../plots/marey";

export const data: MareyData = {
  stops: ["DEPOT", "MARKET", "CANAL", "PARK", "MILL", "PORT"],
  t0: 0, t1: 240,
  xt: [[0, "08:00"], [60, "09:00"], [120, "10:00"], [180, "11:00"], [240, "12:00"]],
  vans: [
    { label: "Van 11", tok: "data/cat-2", times: [[0, 6], [26, 34], [52, 60], [80, 86], [104, 110], [130, 130]] },
    { label: "Van 12", tok: "data/cat-3", times: [[30, 36], [56, 62], [84, 92], [112, 118], [136, 142], [160, 160]] },
    { label: "Van 17", tok: "data/cat-4", times: [[60, 66], [86, 92], [112, 120], [140, 146], [166, 172], [192, 192]] },
    { label: "Van 19", tok: "status/danger", late: true, times: [[90, 96], [120, 126], [150, 192], [214, 220], [232, 236], [240, 240]] },
  ],
  plan: [[90, 96], [116, 122], [142, 150], [170, 176], [196, 202], [222, 222]],
};
