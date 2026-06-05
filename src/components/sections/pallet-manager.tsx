import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { LayerSelector } from "@/components/ui/layer-selector";
import { type SelectedPallet } from "@/components/sections/camera-feed";

// Mock pallets for demonstration purposes
const MOCK_PALLETS = [
  // Layer 1
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
  // Layer 2
  { id: 13, layer: 2, name: "Pallet 1",  label: "Pallet 01", active: true,  description: "Machine parts order #4821. Destination: Assembly Line 2." },
  { id: 14, layer: 2, name: "Pallet 2",  label: "Pallet 02", active: false, description: "Awaiting forklift certification check." },
  { id: 15, layer: 2, name: "Pallet 3",  label: "Pallet 03", active: true,  description: "Pharmaceutical supplies. Temperature-controlled transit required." },
  { id: 16, layer: 2, name: "Pallet 4",  label: "Pallet 04", active: true,  description: "Office furniture flatpacks. Destination: Building 3, Floor 2." },
  { id: 17, layer: 2, name: "Pallet 5",  label: "Pallet 05", active: false, description: "Empty — available for loading." },
  { id: 18, layer: 2, name: "Pallet 6",  label: "Pallet 06", active: true,  description: "Seasonal stock. Low priority. Destination: Overflow Storage." },
  { id: 19, layer: 2, name: "Pallet 7",  label: "Pallet 07", active: true,  description: "Express shipment — priority loading. Departure: 16:30." },
  { id: 20, layer: 2, name: "Pallet 8",  label: "Pallet 08", active: true,  description: "Recycled materials bale. Destination: Processing Plant B." },
  { id: 21, layer: 2, name: "Pallet 9",  label: "Pallet 09", active: false, description: "Maintenance hold — pallet structure compromised." },
  { id: 22, layer: 2, name: "Pallet 10", label: "Pallet 10", active: true,  description: "Consumer electronics. High-value cargo. Requires escort." },
  { id: 23, layer: 2, name: "Pallet 11", label: "Pallet 11", active: true,  description: "Beverages — glass bottles. Upright position only." },
  { id: 24, layer: 2, name: "Pallet 12", label: "Pallet 12", active: false, description: "Reserved — VIP client order." },
  // Layer 3
  { id: 25, layer: 3, name: "Pallet 1",  label: "Pallet 01", active: true,  description: "Raw timber. Forklift access from south side only." },
  { id: 26, layer: 3, name: "Pallet 2",  label: "Pallet 02", active: true,  description: "Paint cans — flammable. Keep away from heat sources." },
  { id: 27, layer: 3, name: "Pallet 3",  label: "Pallet 03", active: false, description: "Pending weight verification." },
  { id: 28, layer: 3, name: "Pallet 4",  label: "Pallet 04", active: true,  description: "Sporting equipment. Destination: Retail Hub East." },
  { id: 29, layer: 3, name: "Pallet 5",  label: "Pallet 05", active: true,  description: "Medical devices — sterile. Do not open packaging." },
  { id: 30, layer: 3, name: "Pallet 6",  label: "Pallet 06", active: false, description: "Empty — scheduled for disposal." },
  { id: 31, layer: 3, name: "Pallet 7",  label: "Pallet 07", active: true,  description: "Automotive fluids — sealed drums. Upright only." },
  { id: 32, layer: 3, name: "Pallet 8",  label: "Pallet 08", active: true,  description: "Luxury goods. Destination: Bonded Warehouse, Bay 9." },
  { id: 33, layer: 3, name: "Pallet 9",  label: "Pallet 09", active: false, description: "Awaiting manifest confirmation." },
  { id: 34, layer: 3, name: "Pallet 10", label: "Pallet 10", active: true,  description: "Construction materials. Heavy load — max speed 5 km/h." },
  { id: 35, layer: 3, name: "Pallet 11", label: "Pallet 11", active: true,  description: "Frozen seafood. Must remain below -18°C at all times." },
  { id: 36, layer: 3, name: "Pallet 12", label: "Pallet 12", active: false, description: "Reserved — loading dock 4 conflict. Resolve before use." },
];

// PalletManager component
interface PalletManagerProps {
  onPalletSelect: (pallet: SelectedPallet | null) => void;
  selectedPalletId: number | null;
}
 
export function PalletManager({ onPalletSelect, selectedPalletId }: PalletManagerProps) {
  const [activeLayer, setActiveLayer] = useState(1);
  const totalLayersList = [1, 2, 3];
 
  const currentLayerPallets = useMemo(
    () => MOCK_PALLETS.filter((p) => p.layer === activeLayer),
    [activeLayer]
  );
 
  const activePalletsCount = currentLayerPallets.filter((p) => p.active).length;
 
  function handlePalletClick(pallet: (typeof MOCK_PALLETS)[number]) {
    if (!pallet.active) return;
    if (pallet.id === selectedPalletId) {
      onPalletSelect(null); // deselect on second click
    } else {
      onPalletSelect({ id: pallet.id, label: pallet.label, description: pallet.description });
    }
  }
 
  return (
    <section className="flex flex-col h-full lg:w-1/2 pr-0 lg:pr-6 py-6 gap-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Pallet Manager</h2>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Active
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-500" />
            Disabled
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Active Pallets" value={`${activePalletsCount}/${currentLayerPallets.length}`} />
        <StatCard title="Total Layers" value={totalLayersList.length} />
      </div>
 
      <div className="w-full">
        <LayerSelector
          layers={totalLayersList}
          activeLayer={activeLayer}
          onLayerChange={(layer) => {
            setActiveLayer(layer);
            onPalletSelect(null); // clear selection when switching layers
          }}
        />
      </div>
 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 content-start">
        {currentLayerPallets.map((pallet) => {
          const isSelected = pallet.id === selectedPalletId;
          return (
            <Card
              key={pallet.id}
              onClick={() => handlePalletClick(pallet)}
              className={`transition-all ${
                pallet.active
                  ? isSelected
                    ? "cursor-pointer border-blue-500/70 bg-blue-950/40 ring-1 ring-blue-500/50"
                    : "cursor-pointer border-green-500/50 bg-black hover:bg-zinc-900"
                  : "border-border/30 bg-black/50 opacity-50 cursor-not-allowed"
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
      </div>
 
      <div className="flex justify-start gap-3 mt-auto">
        <button className="bg-black border border-border/50 hover:bg-zinc-900 text-foreground px-2 py-1 rounded-full font-medium text-sm transition-colors w-[140px]">
          Load
        </button>
        <button className="bg-blue-600 border border-border/50 hover:bg-blue-700 text-white px-2 py-1 rounded-full font-medium text-sm transition-colors w-[140px]">
          Retrieve
        </button>
      </div>
    </section>
  );
}