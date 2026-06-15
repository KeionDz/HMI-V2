import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SLOT_OPTIONS = [4, 8, 12, 16, 20, 24];

interface AddLayerModalProps {
  nextLayerNumber: number;
  onClose: () => void;
  onConfirm: (name: string, slots: number) => void;
}

export function AddLayerModal({ nextLayerNumber, onClose, onConfirm }: AddLayerModalProps) {
  const [name, setName] = useState(`Layer ${nextLayerNumber}`);
  const [slots, setSlots] = useState(12);

  function handleConfirm() {
    if (!name.trim()) return;
    onConfirm(name.trim(), slots);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Configure New Layer</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-px bg-foreground/10" />

          {/* Layer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Layer Name (e.g. Layer {nextLayerNumber})
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
              placeholder={`Layer ${nextLayerNumber}`}
            />
          </div>

          {/* Pallet Configuration */}
          {/* Pallet Configuration Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pallet Configuration
            </label>
            
            {/* 2. Added relative wrapper to position custom chevron icon overlay */}
            <div className="relative w-full flex items-center">
              <select
                value={slots}
                onChange={(e) => setSlots(Number(e.target.value))}
                /* Added pr-10 to make room on right side so text doesn't overlap vector graphic */
                className="w-full h-10 pl-3 pr-10 rounded-lg bg-background border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
              >
                {SLOT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s} slots</option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-3 text-muted-foreground">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="h-px bg-foreground/10" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-full border border-border/50 bg-black hover:bg-zinc-900 text-sm font-medium text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!name.trim()}
              className="flex-1 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add New Layer
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}