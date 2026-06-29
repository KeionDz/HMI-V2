import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/user-service";

export function useGetUserByIdQuery(userId: string | null) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User id is required.");
      }

      return getUserById(userId);
    },
    enabled: Boolean(userId),
  });
}
