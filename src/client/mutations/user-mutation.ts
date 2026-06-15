import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  type CreateUserDto,
  type CreateUserResponse,
} from "@/client/services/user-service";

export const userKeys = {
  all: ["users"] as const,
};

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateUserResponse, Error, CreateUserDto>({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
