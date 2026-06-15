import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLayer, type Layer } from "@/client/services/layer-service";

export const layerKeys = {
  all: ["layers"] as const,
};

export function useCreateLayerMutation() {
  const queryClient = useQueryClient();

  return useMutation<Layer, Error, void>({
    mutationFn: createLayer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: layerKeys.all });
    },
  });
}
