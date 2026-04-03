import type { Message } from "./types";

export const EXAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    authorName: "John Doe",
    authorInitials: "JD",
    asset: "Oil Tank #1",
    date: "03/24/26 12:00 AM",
    dataPoint: "Top Level",
    dataPointValue: `7' 2"`,
    text: "Level spike observed overnight. Monitoring for another cycle before changing threshold.",
  },
  {
    id: "2",
    authorName: "Luis Marcus",
    authorInitials: "LM",
    asset: "EFM/Chart #201",
    date: "03/24/26 08:35 AM",
    dataPoint: "Flow Rate",
    dataPointValue: "287.89 MCF/Day",
    text: "Flow stabilized after morning pressure reset. No additional action needed now.",
  },
];
