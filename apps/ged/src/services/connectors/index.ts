// Libs
import { useSuspenseQuery } from "@tanstack/react-query";

// Data
import { db } from "@/data";

export const connectorsKeys = {
  all: ["connectors"] as const,
  sharepoint: () => [...connectorsKeys.all, "sharepoint"] as const,
};

export function useConnector() {
  return useSuspenseQuery({
    queryKey: connectorsKeys.sharepoint(),
    queryFn: () => db.connector(),
  });
}
