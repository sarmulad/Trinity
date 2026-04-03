import type { TankDetailData } from "./types";

export const EXAMPLE_TANK_DETAIL: TankDetailData = {
  name: "Water Tank",
  topGaugeFt: "4' 8\"",
  topGaugeBbls: "180 BBLs",
  prodBbls: "200 BBLs",
  currentLevel: {
    oil: "4' 3.72\"",
    oilBbls: "200 BBLs",
    gasVolume: "250 MCF",
    total: "5' 6.12\"",
    totalBbls: "260 BBLs",
    time: "3/17/24 8:15AM",
  },
  labels: [
    {
      id: "1",
      name: "Overflow Alarm",
      color: "#ef4444",
      shape: "circle",
      level: "9' 5\"",
    },
    {
      id: "2",
      name: "Exit Point",
      color: "#ffffff",
      shape: "square",
      level: "8' 10\"",
    },
  ],
  tableData: [
    {
      level: "9 FT 8.8 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.46 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.46 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.42 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.34 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.34 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
    {
      level: "9 FT 7.28 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
    },
  ],
  totalEntries: 222,
  chartData: [
    { date: "12/18", value: 2 },
    { date: "12/21", value: 8 },
    { date: "12/25", value: 13 },
    { date: "12/28", value: 13 },
    { date: "2026", value: 13 },
    { date: "01/5", value: 5 },
    { date: "01/7", value: 2 },
    { date: "01/9", value: 8 },
  ],
};
