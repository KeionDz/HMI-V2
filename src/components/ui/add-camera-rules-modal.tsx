import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface AddCameraRulesModalProps {
  onClose: () => void;
  onSave?: (data: { palletNumber: string; cameraAssigned: string }) => void;
}

export function AddCameraRulesModal({ onClose, onSave }: AddCameraRulesModalProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSave) {
      onSave({ palletNumber: "", cameraAssigned: "" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card Shell Container */}
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        
        {/* Header Close Trigger */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-900 hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1.5">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Camera Setup</h3>
        </div>

        {/* Informational Guidance Text Block */}
        <div className="space-y-2">
          <h4 className="text-md font-semibold text-foreground underline">Instructions</h4>
          <p className="text-md text-zinc-400 leading-relaxed">
            When setting up the cameras for the new pallet, please take note of the camera assignments:
          </p>
        </div>

        {/* Rule Assignment Lookup Guide Table */}
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-semibold">
                <th className="px-4 py-2 w-1/2">Pallet Range</th>
                <th className="px-4 py-2 w-1/2">Camera Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="px-4 py-2.5 font-medium">Pallet 1-4</td>
                <td className="px-4 py-2.5 text-zinc-400">Cameras 1-2</td>
              </tr>
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="px-4 py-2.5 font-medium">Pallet 5-8</td>
                <td className="px-4 py-2.5 text-zinc-400">Cameras 3-4</td>
              </tr>
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="px-4 py-2.5 font-medium">Pallet 9-12</td>
                <td className="px-4 py-2.5 text-zinc-400">Cameras 5-6</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Configuration Setup Form Area */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Non-editable Pallet Number Container */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-zinc-400">Pallet Number</Label>
              <input
                type="text"
                disabled
                className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-lg px-3 py-2 text-sm text-zinc-500 cursor-not-allowed select-none"
                placeholder=""
              />
            </div>

        {/* PLACEHOLDER: Dropdown container, MUST BE POPULATED BY BACKEND */}
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-400">Camera Assigned</Label>
  
        {/* Relative wrapper context lets us pin elements over the input canvas */}
        <div className="relative w-full flex items-center">
            <select
            disabled
            className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-lg pl-3 pr-10 py-2 text-sm text-zinc-500 appearance-none cursor-not-allowed select-none focus:outline-none"
            defaultValue=""
            >
            <option value="" disabled hidden>Select a camera...</option>
            </select>
            
            {/* Absolute positioned indicator layout pinned on the right margin margin */}
            <div className="pointer-events-none absolute right-3 text-zinc-500">
            <ChevronDown className="w-4 h-4 stroke-[2]" />
            </div>
        </div>
        </div>
    </div>

          {/* Action Control Button Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-foreground px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}