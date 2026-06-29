import { Camera, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { SYSTEM_CAMERA_OPTIONS } from "@/lib/system-cameras";

export type CameraFormData = {
  id?: string;
  name: string;
  url: string;
};

type CameraAddMode = "new" | "existing";

interface AddCameraFormProps {
  assignmentContext?: {
    layerName: string;
    palletLabel: string;
  };
  assignedCameras?: CameraFormData[];
  existingCameras?: CameraFormData[];
  onCancel: () => void;
  onSubmit: (cameras: CameraFormData[]) => void;
}

function getCameraKey(camera: CameraFormData) {
  return camera.id ?? `${camera.name}-${camera.url}`;
}

export function AddCameraForm({
  assignmentContext,
  assignedCameras = [],
  existingCameras = SYSTEM_CAMERA_OPTIONS,
  onCancel,
  onSubmit,
}: AddCameraFormProps) {
  const [mode, setMode] = useState<CameraAddMode>("new");
  const [camera, setCamera] = useState<CameraFormData>({
    name: "",
    url: "",
  });
  const [selectedExistingCameraKeys, setSelectedExistingCameraKeys] = useState<
    string[]
  >([]);

  const assignedCameraKeys = useMemo(
    () => new Set(assignedCameras.map(getCameraKey)),
    [assignedCameras],
  );

  const availableExistingCameras = useMemo(
    () =>
      existingCameras.filter(
        (existingCamera) => !assignedCameraKeys.has(getCameraKey(existingCamera)),
      ),
    [assignedCameraKeys, existingCameras],
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "existing") {
      const selectedCameras = availableExistingCameras.filter((existingCamera) =>
        selectedExistingCameraKeys.includes(getCameraKey(existingCamera)),
      );

      if (selectedCameras.length === 0) return;
      onSubmit(selectedCameras.map((existingCamera) => ({ ...existingCamera })));
      return;
    }

    onSubmit([{ ...camera }]);
  }

  function toggleExistingCamera(cameraKey: string) {
    setSelectedExistingCameraKeys((current) =>
      current.includes(cameraKey)
        ? current.filter((selectedKey) => selectedKey !== cameraKey)
        : [...current, cameraKey],
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="min-h-0 space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 p-1">
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === "new"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-foreground"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            New Camera
          </button>
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === "existing"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-foreground"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            Existing Cameras
          </button>
        </div>

        {mode === "new" ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-400">
                Camera Name
              </Label>
              <input
                type="text"
                value={camera.name}
                placeholder="e.g., Camera 01"
                onChange={(e) =>
                  setCamera((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-400">
                Camera URL
              </Label>
              <input
                type="url"
                value={camera.url}
                placeholder="rtsp://camera-01/stream"
                onChange={(e) =>
                  setCamera((current) => ({
                    ...current,
                    url: e.target.value,
                  }))
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-400">
              System Cameras
            </Label>
            {availableExistingCameras.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-center text-sm text-zinc-500">
                All system cameras are already assigned.
              </div>
            ) : (
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {availableExistingCameras.map((existingCamera) => {
                  const cameraKey = getCameraKey(existingCamera);
                  const isSelected =
                    selectedExistingCameraKeys.includes(cameraKey);

                  return (
                    <label
                      key={cameraKey}
                      className={`grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-blue-500/60 bg-blue-950/30"
                          : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleExistingCamera(cameraKey)}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-blue-600"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {existingCamera.name}
                        </div>
                        <div className="truncate text-xs text-zinc-500">
                          {existingCamera.url}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {assignmentContext && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Preloaded Assignment
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-zinc-400">
                  Layer
                </Label>
                <input
                  type="text"
                  value={assignmentContext.layerName}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-zinc-400">
                  Pallet
                </Label>
                <input
                  type="text"
                  value={assignmentContext.palletLabel}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-900 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-foreground px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            mode === "existing" && selectedExistingCameraKeys.length === 0
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[120px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {mode === "existing" ? "Add Selected" : "Add"}
        </button>
      </div>
    </form>
  );
}
