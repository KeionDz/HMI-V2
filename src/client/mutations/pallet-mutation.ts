import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPallet,
  type CreatePalletDto,
  type Pallet,
} from "@/client/services/pallet-service";

export const palletKeys = {
  all: ["pallets"] as const,
};

export function useCreatePalletMutation() {
  const queryClient = useQueryClient();

  return useMutation<Pallet, Error, CreatePalletDto>({
    mutationFn: createPallet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: palletKeys.all });
    },
  });
}
