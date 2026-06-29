import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/user-service";

export function useGetUserByIdQuery(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
}
