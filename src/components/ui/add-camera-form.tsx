import { useState } from "react";
import { Label } from "@/components/ui/label";

export type CameraFormData = {
  name: string;
  url: string;
};

interface AddCameraFormProps {
  onCancel: () => void;
  onSubmit: (camera: CameraFormData) => void;
}

export function AddCameraForm({ onCancel, onSubmit }: AddCameraFormProps) {
  const [camera, setCamera] = useState<CameraFormData>({
    name: "",
    url: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(camera);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
        >
          Add
        </button>
      </div>
    </form>
  );
}
