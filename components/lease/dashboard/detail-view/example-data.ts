import type { TankDetailData } from "./types";

export const EXAMPLE_TANK_DETAIL: TankDetailData = {
  name: "Water Tank",
  topGaugeFt: "4' 8\"",
  topGaugeBbls: "180 BBLs",
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
      name: "Pump On",
      color: "#64748b",
      shape: "circle",
      level: "6 FT",
    },
    {
      id: "2",
      name: "Pump Off",
      color: "#475569",
      shape: "square",
      level: "4.5 FT",
    },
  ],
  tableData: [
    {
      level: "9 FT 8.8 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "sensor",
    },
    {
      level: "9 FT 7.46 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "sensor",
    },
    {
      level: "9 FT 7.46 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "manual",
    },
    {
      level: "9 FT 7.42 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "sensor",
    },
    {
      level: "9 FT 7.34 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "manual",
    },
    {
      level: "9 FT 7.34 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "sensor",
    },
    {
      level: "9 FT 7.28 IN",
      volume: "195.05 BBLs",
      dateTime: "January 27, 2026 10:00 PM",
      source: "sensor",
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
