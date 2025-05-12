import { Insert } from "@/types/inserts";
export const INSERTS: Insert[] = [
  {
    key: "d",
    name: "Date",
    action: () => {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    key: "t",
    name: "Time",
    action: () => {
      return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
];