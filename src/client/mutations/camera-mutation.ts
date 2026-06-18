import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCamera,
  getCamera,
  type AddCameraDto,
  type Camera,
} from "@/client/services/camera-service";
import { palletKeys } from "@/client/mutations/pallet-mutation";

export const cameraKeys = {
  all: ["cameras"] as const,
  detail: (id: string) => [...cameraKeys.all, id] as const,
};

export function useAddCameraMutation() {
  const queryClient = useQueryClient();

  return useMutation<Camera, Error, AddCameraDto>({
    mutationFn: addCamera,
    onSuccess: (_camera, variables) => {
      void queryClient.invalidateQueries({ queryKey: cameraKeys.all });
      void queryClient.invalidateQueries({
        queryKey: cameraKeys.detail(variables.palletId),
      });
      void queryClient.invalidateQueries({ queryKey: palletKeys.all });
    },
  });
}

export function useCameraQuery(id: string, enabled = true) {
  return useQuery<Camera[], Error>({
    queryKey: cameraKeys.detail(id),
    queryFn: () => getCamera(id),
    enabled: enabled && Boolean(id),
  });
}
