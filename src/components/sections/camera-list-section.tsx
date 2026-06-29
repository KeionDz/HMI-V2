import { useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Pencil,
  Plus,
  Radio,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AddNewCamera,
  type AddNewCameraData,
  type CameraAssignment,
  type CameraLayerOption,
  type CameraPalletOption,
} from "@/components/ui/add-new-camera";
import { SYSTEM_CAMERA_OPTIONS } from "@/lib/system-cameras";

type ManagedLayer = CameraLayerOption;

type ManagedPallet = CameraPalletOption;

type ManagedCamera = {
  id: string;
  name: string;
  url: string;
  assignments: CameraAssignment[];
};

type CameraDraft = {
  name: string;
  url: string;
  layerId: string;
  palletId: string;
  assignments: CameraAssignment[];
};

const MOCK_LAYERS: ManagedLayer[] = [
  { id: "layer-1", name: "Layer 1" },
  { id: "layer-2", name: "Layer 2" },
  { id: "layer-3", name: "Layer 3" },
];

const MOCK_PALLETS: ManagedPallet[] = [
  { id: "pallet-1", label: "Pallet 01", layerId: "layer-1", isActive: true },
  { id: "pallet-2", label: "Pallet 02", layerId: "layer-1", isActive: false },
  { id: "pallet-3", label: "Pallet 03", layerId: "layer-1", isActive: true },
  { id: "pallet-4", label: "Pallet 04", layerId: "layer-2", isActive: true },
  { id: "pallet-5", label: "Pallet 05", layerId: "layer-2", isActive: false },
  { id: "pallet-6", label: "Pallet 06", layerId: "layer-2", isActive: true },
  { id: "pallet-7", label: "Pallet 07", layerId: "layer-3", isActive: false },
  { id: "pallet-8", label: "Pallet 08", layerId: "layer-3", isActive: true },
];

const MOCK_CAMERA_ASSIGNMENTS: Record<string, CameraAssignment[]> = {
  "camera-1": [
    { layerId: "layer-1", palletId: "pallet-1" },
    { layerId: "layer-2", palletId: "pallet-4" },
  ],
  "camera-2": [{ layerId: "layer-1", palletId: "pallet-2" }],
  "camera-3": [
    { layerId: "layer-2", palletId: "pallet-5" },
    { layerId: "layer-3", palletId: "pallet-8" },
  ],
  "camera-4": [{ layerId: "layer-2", palletId: "pallet-6" }],
  "camera-5": [{ layerId: "layer-3", palletId: "pallet-7" }],
};

const MOCK_CAMERAS: ManagedCamera[] = SYSTEM_CAMERA_OPTIONS.map((camera) => ({
  ...camera,
  assignments: MOCK_CAMERA_ASSIGNMENTS[camera.id] ?? [],
}));

function createEmptyDraft(): CameraDraft {
  return {
    name: "",
    url: "",
    layerId: "",
    palletId: "",
    assignments: [],
  };
}

function getLayer(layerId: string) {
  return MOCK_LAYERS.find((layer) => layer.id === layerId);
}

function getPallet(palletId: string) {
  return MOCK_PALLETS.find((pallet) => pallet.id === palletId);
}

function getAssignmentLabel(assignment: CameraAssignment) {
  const layer = getLayer(assignment.layerId);
  const pallet = getPallet(assignment.palletId);

  return {
    layerName: layer?.name ?? "No layer",
    palletLabel: pallet?.label ?? "No pallet",
    isActive: pallet?.isActive ?? false,
  };
}

function getCameraStatus(camera: ManagedCamera) {
  return camera.assignments.some((assignment) => {
    const pallet = getPallet(assignment.palletId);
    return pallet?.isActive;
  })
    ? "Active"
    : "Inactive";
}

function getUniqueAssignmentNames(
  assignments: CameraAssignment[],
  key: "layerId" | "palletId",
) {
  const names = assignments.map((assignment) => {
    if (key === "layerId") {
      return getLayer(assignment.layerId)?.name ?? "No layer";
    }

    return getPallet(assignment.palletId)?.label ?? "No pallet";
  });

  return Array.from(new Set(names));
}

function getAssignmentSummary(assignments: CameraAssignment[]) {
  if (assignments.length === 0) return "No assignments";

  const first = getAssignmentLabel(assignments[0]);
  const extraCount = assignments.length - 1;

  return `${first.layerName} / ${first.palletLabel}${
    extraCount > 0 ? ` + ${extraCount} more` : ""
  }`;
}

export function CameraListSection() {
  const [cameras, setCameras] = useState<ManagedCamera[]>(MOCK_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState(
    MOCK_CAMERAS[0]?.id ?? null,
  );
  const [cameraModalMode, setCameraModalMode] = useState<"add" | "edit" | null>(
    null,
  );
  const [cameraDraft, setCameraDraft] =
    useState<CameraDraft>(createEmptyDraft());

  const selectedCamera = useMemo(
    () => cameras.find((camera) => camera.id === selectedCameraId) ?? null,
    [cameras, selectedCameraId],
  );

  const assignedPalletIds = new Set(
    cameraDraft.assignments.map((assignment) => assignment.palletId),
  );

  const availablePallets = MOCK_PALLETS.filter(
    (pallet) =>
      pallet.layerId === cameraDraft.layerId &&
      !assignedPalletIds.has(pallet.id),
  );

  function openAddCameraModal() {
    setCameraDraft(createEmptyDraft());
    setCameraModalMode("add");
  }

  function openEditCameraModal(camera: ManagedCamera) {
    setCameraDraft({
      name: camera.name,
      url: camera.url,
      layerId: "",
      palletId: "",
      assignments: camera.assignments,
    });
    setCameraModalMode("edit");
  }

  function closeCameraModal() {
    setCameraModalMode(null);
    setCameraDraft(createEmptyDraft());
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

  function handleCameraSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cameraDraft.assignments.length === 0) return;

    if (cameraModalMode === "edit" && selectedCamera) {
      setCameras((current) =>
        current.map((camera) =>
          camera.id === selectedCamera.id
            ? {
                ...camera,
                name: cameraDraft.name,
                url: cameraDraft.url,
                assignments: cameraDraft.assignments,
              }
            : camera,
        ),
      );
      closeCameraModal();
    }
  }

  function handleAddNewCamera(camera: AddNewCameraData) {
    const nextCamera = {
      id: `camera-${Date.now()}`,
      ...camera,
    };

    setCameras((current) => [...current, nextCamera]);
    setSelectedCameraId(nextCamera.id);
    closeCameraModal();
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Camera Management
          </h2>
          <div className="mt-1 text-sm text-muted-foreground">
            {cameras.length} cameras registered
          </div>
        </div>

        <button
          type="button"
          onClick={openAddCameraModal}
          className="flex h-9 items-center gap-2 rounded-full border border-border/50 bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Camera
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)]">
        <Card className="min-h-0 overflow-hidden">
          <CardContent className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-300">
                All Cameras
              </h3>
              <Radio className="h-4 w-4 text-zinc-500" />
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {cameras.map((camera) => {
                const status = getCameraStatus(camera);
                const isSelected = camera.id === selectedCameraId;

                return (
                  <button
                    key={camera.id}
                    type="button"
                    onClick={() => setSelectedCameraId(camera.id)}
                    className={`grid w-full grid-cols-[auto_1fr] gap-3 rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? "border-blue-500/60 bg-blue-950/30"
                        : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900"
                    }`}
                  >
                    <div
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        status === "Active" ? "bg-green-500" : "bg-zinc-600"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {camera.name}
                        </span>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                            status === "Active"
                              ? "border-green-500/40 bg-green-500/10 text-green-400"
                              : "border-zinc-700 bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="truncate text-xs text-zinc-500">
                        {camera.url}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {getAssignmentSummary(camera.assignments)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-0 overflow-hidden">
          <CardContent className="flex h-full flex-col gap-5">
            {selectedCamera ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold">
                        {selectedCamera.name}
                      </h3>
                      <div className="truncate text-sm text-muted-foreground">
                        {selectedCamera.url}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditCameraModal(selectedCamera)}
                    className="flex h-9 items-center gap-2 rounded-full border border-zinc-800 bg-black px-4 text-sm font-medium text-foreground transition-colors hover:bg-zinc-900"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Status
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          getCameraStatus(selectedCamera) === "Active"
                            ? "text-green-400"
                            : "text-zinc-500"
                        }`}
                      />
                      {getCameraStatus(selectedCamera)}
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Layers
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {getUniqueAssignmentNames(
                        selectedCamera.assignments,
                        "layerId",
                      ).join(", ")}
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Pallets
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {getUniqueAssignmentNames(
                        selectedCamera.assignments,
                        "palletId",
                      ).join(", ")}
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Assignments
                  </div>
                  {selectedCamera.assignments.map((assignment, index) => {
                    const label = getAssignmentLabel(assignment);

                    return (
                      <div
                        key={`${assignment.layerId}-${assignment.palletId}-${index}`}
                        className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground">
                            {label.layerName} / {label.palletLabel}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {label.isActive
                              ? "Active pallet"
                              : "Inactive pallet"}
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                            label.isActive
                              ? "border-green-500/40 bg-green-500/10 text-green-400"
                              : "border-zinc-700 bg-zinc-950 text-zinc-400"
                          }`}
                        >
                          {label.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                Select a camera.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {cameraModalMode === "add" && (
        <AddNewCamera
          layers={MOCK_LAYERS}
          pallets={MOCK_PALLETS}
          onClose={closeCameraModal}
          onSubmit={handleAddNewCamera}
        />
      )}

      {cameraModalMode === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={closeCameraModal}
              aria-label="Close camera modal"
              title="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Edit Camera
              </h3>
            </div>

            <form
              onSubmit={handleCameraSubmit}
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
                          {MOCK_LAYERS.map((layer) => (
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
                      const label = getAssignmentLabel(assignment);

                      return (
                        <div
                          key={`${assignment.layerId}-${assignment.palletId}-${index}`}
                          className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">
                              {label.layerName} / {label.palletLabel}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {label.isActive
                                ? "Active pallet"
                                : "Inactive pallet"}
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
                  onClick={closeCameraModal}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-foreground px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cameraDraft.assignments.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
