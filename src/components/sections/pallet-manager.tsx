import { Package, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { type SelectedPallet } from "@/components/sections/camera-feed";
import { AddLayerModal } from "@/components/ui/add-layer-modal";
import { LayerSelector } from "@/components/ui/layer-selector";

const MOCK_PALLETS = [
  { id: 1,  layer: 1, name: "Pallet 1",  label: "Pallet 01", active: true,  description: "Standard euro-pallet loaded with automotive parts. Destination: Bay A3." },
  { id: 2,  layer: 1, name: "Pallet 2",  label: "Pallet 02", active: true,  description: "Fragile glassware shipment. Handle with care. Destination: Bay B1." },
  { id: 3,  layer: 1, name: "Pallet 3",  label: "Pallet 03", active: false, description: "Awaiting quality inspection. Do not load until cleared." },
  { id: 4,  layer: 1, name: "Pallet 4",  label: "Pallet 04", active: true,  description: "Cold-chain produce. Must remain below 4°C. Destination: Freezer Zone." },
  { id: 5,  layer: 1, name: "Pallet 5",  label: "Pallet 05", active: true,  description: "Electronic components. ESD-sensitive. Destination: Clean Room C." },
  { id: 6,  layer: 1, name: "Pallet 6",  label: "Pallet 06", active: false, description: "On hold — customs clearance pending." },
  { id: 7,  layer: 1, name: "Pallet 7",  label: "Pallet 07", active: true,  description: "Bulk dry goods. No special handling required. Destination: Shelf 12." },
  { id: 8,  layer: 1, name: "Pallet 8",  label: "Pallet 08", active: false, description: "Reserved for incoming shipment ETA 14:00." },
  { id: 9,  layer: 1, name: "Pallet 9",  label: "Pallet 09", active: true,  description: "Hazardous materials — Class 3. Refer to MSDS sheet before handling." },
  { id: 10, layer: 1, name: "Pallet 10", label: "Pallet 10", active: true,  description: "Retail display units. Pre-assembled. Destination: Showroom D." },
  { id: 11, layer: 1, name: "Pallet 11", label: "Pallet 11", active: false, description: "Damaged — pending returns processing." },
  { id: 12, layer: 1, name: "Pallet 12", label: "Pallet 12", active: true,  description: "Textile rolls. Keep dry. Destination: Storage Unit 7." },
];

interface PalletManagerProps {
  onPalletSelect: (pallet: SelectedPallet | null) => void;
  selectedPalletId: number | null;
  isAdmin?: boolean;
  onAddNewPalletClick?: () => void;
}

export function PalletManager({ onPalletSelect, selectedPalletId, isAdmin = false, onAddNewPalletClick }: PalletManagerProps) {
  const [layers, setLayers] = useState([1, 2, 3]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [addLayerModalOpen, setAddLayerModalOpen] = useState(false);
  const [pallets, setPallets] = useState(MOCK_PALLETS);

  // Modal animation tracking states
  const [processingMode, setProcessingMode] = useState<"load" | "retrieve" | null>(null);
  const [progress, setProgress] = useState(0);

  const currentLayerPallets = useMemo(
    () => pallets.filter((p) => p.layer === activeLayer),
    [pallets, activeLayer]
  );

  const activePalletsCount = currentLayerPallets.filter((p) => p.active).length;

  // Find currently selected pallet object context
  const selectedPallet = useMemo(
    () => pallets.find((p) => p.id === selectedPalletId) || null,
    [pallets, selectedPalletId]
  );

  // FIX: Inactive items are now fully clickable
  function handlePalletClick(pallet: (typeof MOCK_PALLETS)[number]) {
    if (pallet.id === selectedPalletId) {
      onPalletSelect(null);
    } else {
      onPalletSelect({ id: pallet.id, label: pallet.label, description: pallet.description });
    }
  }

  // Automated counter update loop for full-screen overlay workflow
  useEffect(() => {
    let interval: number;

    if (processingMode) {
      setProgress(0);
      
      // 2. Explicitly append window. to your method call
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [processingMode]);

  function triggerProcess(mode: "load" | "retrieve") {
    if (!selectedPalletId) return;
    setProcessingMode(mode);
  }

  function handleProcessCompletion() {
    if (!selectedPalletId || !processingMode) return;

    setPallets((prev) =>
      prev.map((p) => {
        if (p.id === selectedPalletId) {
          return { ...p, active: processingMode === "load" };
        }
        return p;
      })
    );

    // Refresh display references
    const updated = pallets.find((p) => p.id === selectedPalletId);
    if (updated) {
      onPalletSelect({
        ...updated,
        description: updated.description
      });
    }

    setProcessingMode(null);
    setProgress(0);
  }

  function handleAddLayerConfirm(name: string, slots: number) {
    const next = layers.length + 1;
    const maxId = pallets.length > 0 ? Math.max(...pallets.map((p) => p.id)) : 0;
    const newPallets = Array.from({ length: slots }, (_, i) => ({
      id: maxId + i + 1,
      layer: next,
      name: `Pallet ${i + 1}`,
      label: `Pallet ${String(i + 1).padStart(2, "0")}`,
      active: false,
      description: "",
    }));
    setPallets((prev) => [...prev, ...newPallets]);
    setLayers((prev) => [...prev, next]);
    setActiveLayer(next);
    onPalletSelect(null);
    setAddLayerModalOpen(false);
  }

  function handleDeleteLayer(layerToDelete: number) {
    if (layers.length === 1) return;
    const updated = layers.filter((l) => l !== layerToDelete);
    setLayers(updated);
    setPallets((prev) => prev.filter((p) => p.layer !== layerToDelete));
    if (activeLayer === layerToDelete) {
      const idx = layers.indexOf(layerToDelete);
      setActiveLayer(updated[Math.max(0, idx - 1)]);
    }
    onPalletSelect(null);
  }

  return (
    <section className="flex flex-col w-full h-full gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Pallet Manager</h2>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Active
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-500" />
            Inactive
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Active Pallets" value={`${activePalletsCount}/${currentLayerPallets.length}`} />
        <StatCard title="Total Layers" value={layers.length} />
      </div>

      <div className="flex items-center gap-2 w-full">
        <LayerSelector
          layers={layers}
          activeLayer={activeLayer}
          isAdmin={isAdmin}
          onLayerChange={(layerNum) => {
            setActiveLayer(layerNum);
            onPalletSelect(null);
          }}
          onDeleteLayer={handleDeleteLayer}
        />

        {isAdmin && (
          <button
            onClick={() => setAddLayerModalOpen(true)}
            className="shrink-0 w-8 h-8 rounded-full border border-border/50 bg-black hover:bg-zinc-900 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            title="Add layer"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pallet Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 content-start pb-6">
        {currentLayerPallets.map((pallet) => {
          const isSelected = pallet.id === selectedPalletId;
          return (
            <Card
              key={pallet.id}
              onClick={() => handlePalletClick(pallet)}
              className={`className="transition-all duration-200" ${
                isSelected
                  ? "cursor-pointer border-blue-500/70 bg-blue-950/40 ring-1 ring-blue-500/50"
                  : pallet.active
                    ? "cursor-pointer border-green-500/50 bg-black hover:bg-zinc-900"
                    : "cursor-pointer border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60"
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                <Package
                  className={`w-6 h-6 ${
                    isSelected ? "text-blue-400" : pallet.active ? "text-green-500" : "text-zinc-600"
                  }`}
                />
                <div className="text-center">
                  <Label className="font-semibold text-sm cursor-pointer">{pallet.name}</Label>
                  <div className="text-xs text-zinc-500">{pallet.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {isAdmin && (
          <Card
            onClick={() => { if (onAddNewPalletClick) onAddNewPalletClick(); }}
            className="cursor-pointer border-dashed border-zinc-700 bg-zinc-950/30 hover:bg-zinc-900 hover:border-zinc-500 transition-all min-h-[106px] flex items-center justify-center"
          >
            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-6 h-6 stroke-[1.5]" />
              <div className="text-center">
                <span className="font-medium text-xs tracking-wide">Add New Pallet</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dynamic Action Buttons Footer */}
      {!isAdmin && (
        <div className="flex justify-start gap-3 pt-4 border-t border-border/20 mt-auto">
          <button
            onClick={() => triggerProcess("load")}
            disabled={!selectedPalletId || selectedPallet?.active}
            className="cursor-pointer bg-black border border-border/50 hover:bg-zinc-900 text-foreground px-2 py-1 rounded-full font-medium text-sm transition-colors w-[140px] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Load
          </button>
          <button
            onClick={() => triggerProcess("retrieve")}
            disabled={!selectedPalletId || !selectedPallet?.active}
            className="cursor-pointer bg-blue-600 border border-border/50 hover:bg-blue-700 text-white px-2 py-1 rounded-full font-medium text-sm transition-colors w-[140px] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Retrieve
          </button>
        </div>
      )}

      {/* Add Layer Modal */}
      {addLayerModalOpen && (
        <AddLayerModal
          nextLayerNumber={layers.length + 1}
          onClose={() => setAddLayerModalOpen(false)}
          onConfirm={handleAddLayerConfirm}
        />
      )}

      {/* Modal for Load and Retrieve Mode */}
      {processingMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl flex flex-col items-center text-center gap-6">
            
            {/* Spinning Indicator */}
            <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-zinc-800 animate-spin flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold capitalize tracking-tight">
                {processingMode === "load" ? "Loading Process" : "Retrieval Mode"}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                {processingMode === "load" 
                  ? `Loading ${selectedPallet?.label || 'location'}...`
                  : `Retrieving ${selectedPallet?.label || 'pallet location'}...`
                }
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                <div 
                  className="h-full bg-blue-500 transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-zinc-500">{progress}% Complete</div>
            </div>

            {/* Step Complete Button */}
            {progress === 100 && (
              <button
                onClick={handleProcessCompletion}
                className="w-full bg-foreground text-background font-semibold text-sm h-10 rounded-xl hover:bg-foreground/90 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-200 cursor-pointer"
              >
                Return to Pallet Manager
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}