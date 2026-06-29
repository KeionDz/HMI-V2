import { useState } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";

export type CameraLayerOption = {
  id: string;
  name: string;
};

export type CameraPalletOption = {
  id: string;
  label: string;
  layerId: string;
  isActive: boolean;
};

export type CameraAssignment = {
  layerId: string;
  palletId: string;
};

export type AddNewCameraData = {
  name: string;
  url: string;
  assignments: CameraAssignment[];
};

type CameraDraft = AddNewCameraData & {
  layerId: string;
  palletId: string;
};

interface AddNewCameraProps {
  layers: CameraLayerOption[];
  pallets: CameraPalletOption[];
  onClose: () => void;
  onSubmit: (camera: AddNewCameraData) => void;
}

function createEmptyDraft(): CameraDraft {
  return {
    name: "",
    url: "",
    layerId: "",
    palletId: "",
    assignments: [],
  };
}

export function AddNewCamera({
  layers,
  pallets,
  onClose,
  onSubmit,
}: AddNewCameraProps) {
  const [cameraDraft, setCameraDraft] = useState<CameraDraft>(
    createEmptyDraft(),
  );

  const assignedPalletIds = new Set(
    cameraDraft.assignments.map((assignment) => assignment.palletId),
  );
  const availablePallets = pallets.filter(
    (pallet) =>
      pallet.layerId === cameraDraft.layerId && !assignedPalletIds.has(pallet.id),
  );

  function getLayer(layerId: string) {
    return layers.find((layer) => layer.id === layerId);
  }

  function getPallet(palletId: string) {
    return pallets.find((pallet) => pallet.id === palletId);
  }

  function handleLayerChange(layerId: string) {
    setCameraDraft((current) => ({
      ...current,
      layerId,
      palletId: "",
    }));
  }

  function handleAddAssignment() {
    if (!cameraDraft.layerId || !cameraDraft.palletId) return;

    setCameraDraft((current) => ({
      ...current,
      assignments: [
        ...current.assignments,
        {
          layerId: current.layerId,
          palletId: current.palletId,
        },
      ],
      layerId: "",
      palletId: "",
    }));
  }

  function handleRemoveAssignment(indexToRemove: number) {
    setCameraDraft((current) => ({
      ...current,
      assignments: current.assignments.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cameraDraft.assignments.length === 0) return;

    onSubmit({
      name: cameraDraft.name,
      url: cameraDraft.url,
      assignments: cameraDraft.assignments,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close add camera modal"
          title="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Add Camera
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-400">
                Camera Name
              </Label>
              <input
                type="text"
                value={cameraDraft.name}
                placeholder="e.g., Camera 01"
                onChange={(e) =>
                  setCameraDraft((current) => ({
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
                value={cameraDraft.url}
                placeholder="rtsp://camera-01/stream"
                onChange={(e) =>
                  setCameraDraft((current) => ({
                    ...current,
                    url: e.target.value,
                  }))
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-zinc-400">
                    Layer
                  </Label>
                  <div className="relative flex items-center">
                    <select
                      value={cameraDraft.layerId}
                      onChange={(e) => handleLayerChange(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-foreground appearance-none focus:outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select layer
                      </option>
                      {layers.map((layer) => (
                        <option key={layer.id} value={layer.id}>
                          {layer.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-zinc-400">
                    Pallet
                  </Label>
                  <div className="relative flex items-center">
                    <select
                      value={cameraDraft.palletId}
                      onChange={(e) =>
                        setCameraDraft((current) => ({
                          ...current,
                          palletId: e.target.value,
                        }))
                      }
                      disabled={!cameraDraft.layerId}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm text-foreground appearance-none focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-zinc-600"
                    >
                      <option value="" disabled>
                        Select pallet
                      </option>
                      {availablePallets.map((pallet) => (
                        <option key={pallet.id} value={pallet.id}>
                          {pallet.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-zinc-500" />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddAssignment}
                    disabled={!cameraDraft.layerId || !cameraDraft.palletId}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-black px-3 text-xs font-medium text-foreground transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 md:w-[104px]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Assign
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Camera Assignments
              </div>
              {cameraDraft.assignments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-5 text-center text-sm text-zinc-500">
                  Add at least one layer and pallet assignment.
                </div>
              ) : (
                cameraDraft.assignments.map((assignment, index) => {
                  const layer = getLayer(assignment.layerId);
                  const pallet = getPallet(assignment.palletId);

                  return (
                    <div
                      key={`${assignment.layerId}-${assignment.palletId}-${index}`}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {layer?.name ?? "No layer"} /{" "}
                          {pallet?.label ?? "No pallet"}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {pallet?.isActive ? "Active pallet" : "Inactive pallet"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignment(index)}
                        aria-label="Remove camera assignment"
                        title="Remove assignment"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-black text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-900 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-foreground px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={cameraDraft.assignments.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
