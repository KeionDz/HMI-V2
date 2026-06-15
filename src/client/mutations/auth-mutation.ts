import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  signUp,
  type AuthUser,
  type LoginDto,
  type LoginResponse,
  type SignUpDto,
} from "@/client/services/auth-service";
import { userKeys } from "@/client/mutations/user-mutation";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, SignUpDto>({
    mutationFn: signUp,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginDto>({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}
