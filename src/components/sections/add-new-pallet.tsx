import { useState } from "react";
import { Camera, VideoOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { AddCameraRulesModal } from "@/components/ui/add-camera-rules-modal"; // Verify this path matches your directory setup

interface AddNewPalletProps {
  onCancel: () => void;
  onSave?: (palletData: any) => void;
}

export default function AddNewPallet({ onCancel, onSave }: AddNewPalletProps) {
  const [locationId, setLocationId] = useState("001");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [cameraUrl, setCameraUrl] = useState("");
  const [previewActive, setPreviewActive] = useState(false);
  
  // 1. New local state to manage the Camera Rules setup modal layout display
  const [cameraRulesModalOpen, setCameraRulesModalOpen] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (onSave) {
      onSave({ locationId, label, description, cameraUrl });
    }
  }

  return (
    <section className="flex flex-col w-full h-full gap-6">
      <h2 className="text-2xl font-bold tracking-tight">Add New Pallet</h2>

      <form onSubmit={handleSave} className="flex flex-col flex-1 gap-4 overflow-y-auto pr-1">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-400">Location ID</Label>
          <input
            type="text"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-400">Label (Max 12 characters)</Label>
          <input
            type="text"
            value={label}
            maxLength={12}
            placeholder="e.g., Pallet 01"
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-400">Description (Max 100 characters)</Label>
          <textarea
            value={description}
            maxLength={100}
            rows={3}
            placeholder="Enter pallet details..."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 resize-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-zinc-400">Live Camera URL</Label>
          <input
            type="url"
            value={cameraUrl}
            placeholder="https://rtsp.stream/feed/..."
            onChange={(e) => setCameraUrl(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Video Preview Canvas Window */}
        <div className="relative flex flex-col items-center justify-center border border-zinc-800 bg-[#1d2338] rounded-xl h-[240px] text-center px-4 mt-2">
          {previewActive && cameraUrl ? (
            <div className="text-blue-400 flex flex-col items-center gap-2">
              <Camera className="w-8 h-8 animate-pulse" />
              <p className="text-xs text-zinc-400">Displaying live feed preview...</p>
            </div>
          ) : (
            <div className="text-indigo-200/50 flex flex-col items-center">
              <VideoOff className="w-10 h-10 mb-2" strokeWidth={1.5} />
              <p className="text-xs">Camera setup preview window</p>
            </div>
          )}

          {/* Sub-navigation pill menu inside video view */}
          <div className="absolute bottom-3 right-3 flex items-center bg-zinc-950 p-1 rounded-full border border-zinc-800 gap-1">
            {/* 2. Added modal toggle switch trigger handling onto this tab action */}
            <button
              type="button"
              onClick={() => setCameraRulesModalOpen(true)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-transparent text-zinc-400 hover:text-foreground transition-colors cursor-pointer"
            >
              Camera Rules
            </button>
            <button
              type="button"
              onClick={() => setPreviewActive(true)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                previewActive ? "bg-zinc-700 text-foreground" : "text-zinc-400 hover:text-foreground"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Control Button Wrapper Footer */}
        <div className="flex justify-start gap-3 pt-4 border-t border-zinc-800 mt-auto">
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

      {/* 3. Conditional injection gate mapping rule context modal overlay */}
      {cameraRulesModalOpen && (
        <AddCameraRulesModal
          onClose={() => setCameraRulesModalOpen(false)}
          onSave={(data) => {
            console.log("Camera configurations saved to mock context payload:", data);
            setCameraRulesModalOpen(false);
          }}
        />
      )}
    </section>
  );
}