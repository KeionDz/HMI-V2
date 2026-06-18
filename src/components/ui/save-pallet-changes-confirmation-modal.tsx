import { CheckCircle2, X } from "lucide-react";

interface SavePalletChangesConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function SavePalletChangesConfirmationModal({
  onClose,
  onConfirm,
}: SavePalletChangesConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close save pallet confirmation"
          title="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-start gap-3 pr-8">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Save Pallet Changes
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Apply the edited pallet details and camera assignments.
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-medium text-xs transition-colors w-[100px]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
