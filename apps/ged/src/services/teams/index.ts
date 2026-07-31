// Libs
import { useSuspenseQuery } from "@tanstack/react-query";

// Data
import { db } from "@/data";

export const teamsKeys = {
  all: ["teams"] as const,
};

export function useTeams() {
  return useSuspenseQuery({
    queryKey: teamsKeys.all,
    queryFn: () => db.teams(),
  });
}
