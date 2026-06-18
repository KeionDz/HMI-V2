import {
  Camera,
  Check,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  VideoOff,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  AddCameraForm,
  type CameraFormData,
} from "@/components/ui/add-camera-form";
import { EditCameraForm } from "@/components/ui/edit-camera-form";
import { DeleteCameraConfirmationModal } from "@/components/ui/delete-camera-confirmation-modal";
import { SavePalletChangesConfirmationModal } from "@/components/ui/save-pallet-changes-confirmation-modal";

export interface SelectedPallet {
  id: number;
  label: string;
  description: string;
  beginCell: string;
  endStation: string;
  isActive: boolean;
  cameras: CameraFormData[];
}

interface CameraFeedProps {
  selectedPallet?: SelectedPallet | null;
  isAdmin?: boolean;
  onUpdatePallet?: (updatedPallet: SelectedPallet) => void;
}

export function CameraFeed({
  selectedPallet,
  isAdmin = false,
  onUpdatePallet,
}: CameraFeedProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBeginCell, setEditBeginCell] = useState("");
  const [editEndStation, setEditEndStation] = useState("");
  const [editIsActive, setEditIsActive] = useState(false);
  const [editCameras, setEditCameras] = useState<CameraFormData[]>([]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [editingCameraIndex, setEditingCameraIndex] = useState<number | null>(
    null,
  );
  const [cameraPendingDeleteIndex, setCameraPendingDeleteIndex] = useState<
    number | null
  >(null);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);

  useEffect(() => {
    if (selectedPallet) {
      setEditLabel(selectedPallet.label);
      setEditDescription(selectedPallet.description);
      setEditBeginCell(selectedPallet.beginCell);
      setEditEndStation(selectedPallet.endStation);
      setEditIsActive(selectedPallet.isActive);
      setEditCameras(selectedPallet.cameras);
      setIsEditing(false);
      setCameraModalOpen(false);
      setEditingCameraIndex(null);
      setCameraPendingDeleteIndex(null);
      setSaveConfirmationOpen(false);
    }
  }, [selectedPallet]);

  function handleConfirmSave() {
    if (selectedPallet && onUpdatePallet) {
      onUpdatePallet({
        ...selectedPallet,
        label: editLabel,
        description: editDescription,
        beginCell: editBeginCell,
        endStation: editEndStation,
        isActive: editIsActive,
        cameras: editCameras,
      });
    }
    setSaveConfirmationOpen(false);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    if (selectedPallet) {
      setEditLabel(selectedPallet.label);
      setEditDescription(selectedPallet.description);
      setEditBeginCell(selectedPallet.beginCell);
      setEditEndStation(selectedPallet.endStation);
      setEditIsActive(selectedPallet.isActive);
      setEditCameras(selectedPallet.cameras);
    }
    setIsEditing(false);
    setCameraModalOpen(false);
    setEditingCameraIndex(null);
    setCameraPendingDeleteIndex(null);
    setSaveConfirmationOpen(false);
  }

  function handleOpenAddCameraModal() {
    setEditingCameraIndex(null);
    setCameraModalOpen(true);
  }

  function handleOpenEditCameraModal(index: number) {
    setEditingCameraIndex(index);
    setCameraModalOpen(true);
  }

  function handleAddCamera(camera: CameraFormData) {
    setEditCameras((current) => [...current, camera]);
    setCameraModalOpen(false);
  }

  function handleEditCamera(camera: CameraFormData) {
    setEditCameras((current) =>
      current.map((existingCamera, index) =>
        index === editingCameraIndex ? camera : existingCamera,
      ),
    );
    setEditingCameraIndex(null);
    setCameraModalOpen(false);
  }

  function handleConfirmRemoveCamera() {
    if (cameraPendingDeleteIndex === null) return;
    setEditCameras((current) =>
      current.filter(
        (_, cameraIndex) => cameraIndex !== cameraPendingDeleteIndex,
      ),
    );
    setCameraPendingDeleteIndex(null);
  }

  function handleCloseCameraModal() {
    setEditingCameraIndex(null);
    setCameraModalOpen(false);
  }

  const visibleCameras = isEditing
    ? editCameras
    : selectedPallet?.cameras ?? [];

  return (
    <section className="flex flex-col w-full h-full min-h-0 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Camera Feed</h2>
        <div className="cursor-pointer flex items-center gap-1.5 bg-blue-500/20 text-blue-500 px-2.5 py-1 rounded border border-blue-500/30 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          Live
        </div>
      </div>

      <div className="h-[420px] shrink-0 rounded-xl border border-border/20 bg-[#1d2338] relative flex flex-col items-center justify-center text-center px-4">
        <div className="text-indigo-200/50 flex flex-col items-center">
          <VideoOff className="w-12 h-12 mb-4" strokeWidth={1.5} />
          <p className="text-sm">Select a pallet location to activate the live camera</p>
        </div>
        <button className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-medium text-indigo-200/50 hover:text-indigo-200 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
          Restart
        </button>
      </div>

      {selectedPallet && (
        <div className="flex min-h-0 flex-1 flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="min-h-0 flex-1 overflow-hidden">
            <CardContent className="h-full space-y-3 overflow-y-auto pr-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                  Label
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-border/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {selectedPallet.label}
                  </span>
                )}
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="flex items-start gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-28 shrink-0 pt-1">
                  Description
                </span>
                {isEditing ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="flex-1 bg-zinc-900 border border-border/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-blue-500 resize-none"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPallet.description}
                  </span>
                )}
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                    Begin Cell
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editBeginCell}
                      onChange={(e) => setEditBeginCell(e.target.value)}
                      className="min-w-0 flex-1 bg-zinc-900 border border-border/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {selectedPallet.beginCell}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                    End Station
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editEndStation}
                      onChange={(e) => setEditEndStation(e.target.value)}
                      className="min-w-0 flex-1 bg-zinc-900 border border-border/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {selectedPallet.endStation}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-28 shrink-0">
                  Active
                </span>
                {isEditing ? (
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-blue-600"
                    />
                    Active
                  </label>
                ) : (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      selectedPallet.isActive
                        ? "border-green-500/40 bg-green-500/10 text-green-400"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {selectedPallet.isActive ? "Active" : "Inactive"}
                  </span>
                )}
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Assigned Cameras
                  </span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleOpenAddCameraModal}
                      className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-800 bg-black px-3 text-xs font-medium text-foreground transition-colors hover:bg-zinc-900"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Camera
                    </button>
                  )}
                </div>

                {visibleCameras.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-4 text-center text-sm text-zinc-500">
                    No cameras assigned.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visibleCameras.map((camera, index) => (
                      <div
                        key={`${camera.name}-${index}`}
                        className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-foreground">
                            {camera.name}
                          </div>
                          <div className="truncate text-xs text-zinc-500">
                            {camera.url}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCameraModal(index)}
                              aria-label="Edit camera"
                              title="Edit camera"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-black text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setCameraPendingDeleteIndex(index)}
                              aria-label="Remove camera"
                              title="Remove camera"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-black text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <div className="flex justify-start gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setSaveConfirmationOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-600 border border-border/50 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full font-medium text-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1.5 bg-black border border-border/50 hover:bg-zinc-900 text-foreground px-4 py-1.5 rounded-full font-medium text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-black border border-border/50 hover:bg-zinc-900 text-foreground px-4 py-1.5 rounded-full font-medium text-sm transition-colors w-[120px] justify-center"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={handleCloseCameraModal}
              aria-label="Close camera modal"
              title="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {editingCameraIndex === null ? "Add Camera" : "Edit Camera"}
              </h3>
            </div>

            {editingCameraIndex === null ? (
              <AddCameraForm
                onCancel={handleCloseCameraModal}
                onSubmit={handleAddCamera}
              />
            ) : (
              <EditCameraForm
                camera={editCameras[editingCameraIndex]}
                onCancel={handleCloseCameraModal}
                onSubmit={handleEditCamera}
              />
            )}
          </div>
        </div>
      )}

      {cameraPendingDeleteIndex !== null && (
        <DeleteCameraConfirmationModal
          cameraName={editCameras[cameraPendingDeleteIndex]?.name}
          onClose={() => setCameraPendingDeleteIndex(null)}
          onConfirm={handleConfirmRemoveCamera}
        />
      )}

      {saveConfirmationOpen && (
        <SavePalletChangesConfirmationModal
          onClose={() => setSaveConfirmationOpen(false)}
          onConfirm={handleConfirmSave}
        />
      )}
    </section>
  );
}
