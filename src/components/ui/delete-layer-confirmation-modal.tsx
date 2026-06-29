import { AlertTriangle, X } from "lucide-react";

interface DeleteLayerConfirmationModalProps {
  layerNumber: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteLayerConfirmationModal({
  layerNumber,
  onClose,
  onConfirm,
}: DeleteLayerConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close delete layer confirmation"
          title="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-start gap-3 pr-8">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Delete Layer
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              This will remove Layer {layerNumber} and its pallet slots.
            </p>
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
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
