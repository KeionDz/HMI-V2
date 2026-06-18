import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  AddCameraForm,
  type CameraFormData,
} from "@/components/ui/add-camera-form";
import { EditCameraForm } from "@/components/ui/edit-camera-form";
import { DeleteCameraConfirmationModal } from "@/components/ui/delete-camera-confirmation-modal";

type AddNewPalletFormData = {
  label: string;
  description: string;
  beginCell: string;
  endStation: string;
  isActive: boolean;
  cameras: CameraFormData[];
};

interface AddNewPalletProps {
  onCancel: () => void;
  onSave?: (palletData: AddNewPalletFormData) => void;
}

export default function AddNewPallet({ onCancel, onSave }: AddNewPalletProps) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [beginCell, setBeginCell] = useState("");
  const [endStation, setEndStation] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [cameras, setCameras] = useState<CameraFormData[]>([]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [editingCameraIndex, setEditingCameraIndex] = useState<number | null>(
    null,
  );
  const [cameraPendingDeleteIndex, setCameraPendingDeleteIndex] = useState<
    number | null
  >(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (onSave) {
      onSave({
        label,
        description,
        beginCell,
        endStation,
        isActive,
        cameras,
      });
    }
  }

  function handleOpenCameraModal() {
    setEditingCameraIndex(null);
    setCameraModalOpen(true);
  }

  function handleOpenEditCameraModal(index: number) {
    setEditingCameraIndex(index);
    setCameraModalOpen(true);
  }

  function handleAddCamera(camera: CameraFormData) {
    setCameras((current) => [...current, camera]);
    setCameraModalOpen(false);
  }

  function handleEditCamera(camera: CameraFormData) {
    setCameras((current) =>
      current.map((existingCamera, index) =>
        index === editingCameraIndex ? camera : existingCamera,
      ),
    );
    setEditingCameraIndex(null);
    setCameraModalOpen(false);
  }

  function handleConfirmRemoveCamera() {
    if (cameraPendingDeleteIndex === null) return;
    setCameras((current) =>
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

  return (
    <section className="flex flex-col w-full h-full min-h-0 gap-6">
      <h2 className="text-2xl font-bold tracking-tight">Add New Pallet</h2>

      <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-400">Label</Label>
            <input
              type="text"
              value={label}
              placeholder="e.g., Pallet 01"
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-zinc-400">Description</Label>
            <textarea
              value={description}
              rows={3}
              placeholder="Enter pallet details..."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-400">Begin Cell</Label>
              <input
                type="text"
                value={beginCell}
                placeholder="e.g., A1"
                onChange={(e) => setBeginCell(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-zinc-400">End Station</Label>
              <input
                type="text"
                value={endStation}
                placeholder="e.g., Station 04"
                onChange={(e) => setEndStation(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-3">
            <span className="text-sm font-medium text-zinc-300">Active</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-blue-600"
            />
          </label>

          <div className="space-y-3 border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-300">Assigned Cameras</h3>
              <button
                type="button"
                onClick={handleOpenCameraModal}
                className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-800 bg-black px-3 text-xs font-medium text-foreground transition-colors hover:bg-zinc-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Camera
              </button>
            </div>

            {cameras.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-center text-sm text-zinc-500">
                No cameras assigned.
              </div>
            ) : (
              <div className="space-y-2">
                {cameras.map((camera, index) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start gap-3 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-black border border-zinc-800 hover:bg-zinc-900 text-foreground px-6 py-1.5 rounded-full font-medium text-sm transition-colors w-[150px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 border border-border/50 hover:bg-blue-700 text-white px-6 py-1.5 rounded-full font-medium text-sm transition-colors w-[150px]"
          >
            Save Changes
          </button>
        </div>
      </form>

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
                camera={cameras[editingCameraIndex]}
                onCancel={handleCloseCameraModal}
                onSubmit={handleEditCamera}
              />
            )}
          </div>
        </div>
      )}

      {cameraPendingDeleteIndex !== null && (
        <DeleteCameraConfirmationModal
          cameraName={cameras[cameraPendingDeleteIndex]?.name}
          onClose={() => setCameraPendingDeleteIndex(null)}
          onConfirm={handleConfirmRemoveCamera}
        />
      )}
    </section>
  );
}
