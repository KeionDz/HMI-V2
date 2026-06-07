import { Camera, VideoOff, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface SelectedPallet {
  id: number;
  label: string;
  description: string;
}

interface CameraFeedProps {
  selectedPallet?: SelectedPallet | null;
}

export function CameraFeed({ selectedPallet }: CameraFeedProps) {
  return (
    <section className="flex flex-col h-full w-full lg:w-1/2 pl-0 lg:pl-6 py-6">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-bold tracking-tight">Camera Feed</h2>
        <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-500 px-2.5 py-1 rounded border border-blue-500/30 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          Live
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-border/20 bg-[#1d2338] relative min-h-[490px] flex flex-col items-center justify-center text-center px-4">
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
        <Card className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-24 shrink-0">
                Label
              </span>
              <span className="text-sm font-semibold">{selectedPallet.label}</span>
            </div>
            <div className="h-px bg-foreground/10" />
            <div className="flex items-start gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-24 shrink-0 pt-0.5">
                Description
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {selectedPallet.description}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}