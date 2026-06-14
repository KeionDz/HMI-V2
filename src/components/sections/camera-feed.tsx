import { Camera, VideoOff, RotateCcw, Pencil, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export interface SelectedPallet {
  id: number;
  label: string;
  description: string;
}

interface CameraFeedProps {
  selectedPallet?: SelectedPallet | null;
  isAdmin?: boolean;
  onUpdatePallet?: (updatedPallet: SelectedPallet) => void;
}

export function CameraFeed({ selectedPallet, isAdmin = false, onUpdatePallet }: CameraFeedProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (selectedPallet) {
      setEditLabel(selectedPallet.label);
      setEditDescription(selectedPallet.description);
      setIsEditing(false); 
    }
  }, [selectedPallet]);

  function handleSave() {
    if (selectedPallet && onUpdatePallet) {
      onUpdatePallet({ ...selectedPallet, label: editLabel, description: editDescription });
    }
    setIsEditing(false);
  }

  return (
    <section className="flex flex-col w-full h-full gap-6">
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
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-24 shrink-0">
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
                  <span className="text-sm font-semibold">{selectedPallet.label}</span>
                )}
              </div>

              <div className="h-px bg-foreground/10" />

              <div className="flex items-start gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-24 shrink-0 pt-1">
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
            </CardContent>
          </Card>

          {isAdmin && (
            <div className="flex justify-start gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 bg-blue-600 border border-border/50 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full font-medium text-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditLabel(selectedPallet.label);
                      setEditDescription(selectedPallet.description);
                    }}
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
    </section>
  );
}